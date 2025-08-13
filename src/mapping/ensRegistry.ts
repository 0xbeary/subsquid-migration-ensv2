import * as abi from '../abi/Registry'
import {CtxWithCache, Log} from '../processor'
import {
    ADDR_EMPTY,
    ADDR_ENS_REGISTRY,
    ADDR_ENS_REGISTRY_OLD,
    ROOT_NODE,
} from './share/constants'
import {createMapping} from './'
import {
    Account,
    Domain,
    NewOwner,
    NewResolver,
    NewTTL,
    Resolver,
    Transfer,
} from '../model'
import {hexToByteArray} from '../utils'
import {
    createResolverId,
    createSubnodeId,
    instantiateEmptyAddrResolver,
    instantiateEventData,
    instantiateMinimalDomain,
    labelNameByHash,
} from './share/entities'

export const mapping = createMapping(abi, ADDR_ENS_REGISTRY)

mapping.handlers.handleNewOwner = (ctx, log, event) =>
    handleNewOwner(ctx, log, event)
mapping.handlers.handleTransfer = (ctx, log, event) =>
    handleTransfer(ctx, log, event)
mapping.handlers.handleNewResolver = (ctx, log, event) =>
    handleNewResolver(ctx, log, event)
mapping.handlers.handleNewTTL = (ctx, log, event) =>
    handleNewTTL(ctx, log, event)

export const mappingOld = createMapping(abi, ADDR_ENS_REGISTRY_OLD)
mappingOld.handlers.handleNewOwner = (ctx, log, event) =>
    handleNewOwner(ctx, log, event, true)
mappingOld.handlers.handleTransfer = (ctx, log, event) =>
    handleTransfer(ctx, log, event, true)
mappingOld.handlers.handleNewResolver = (ctx, log, event) =>
    handleNewResolver(ctx, log, event, true)
mappingOld.handlers.handleNewTTL = (ctx, log, event) =>
    handleNewTTL(ctx, log, event, true)

/**
 * Recursively decrease a subdomainCount if needed.
 *
 * @param ctx
 * @param domain
 */
function recurseDomainDelete(ctx: CtxWithCache, domain: Domain) {
    if (!domain.parent) {
        return
    }
    const resolverIsEmpty =
        !domain.resolver || domain.resolver.id.split('-')[0] == ADDR_EMPTY
    if (
        resolverIsEmpty &&
        domain.owner.id === ADDR_EMPTY &&
        domain.subdomainCount === 0
    ) {
        const parentDomainDeferred = ctx.esm.prepare(Domain, domain.parent.id, {
            parent: true,
            owner: true,
            resolver: true,
        })
        // Add a task to the queue to handle the parent domain.
        ctx.queue.enqueue(() => {
            // Fetch the parent domain.
            const parentDomain = parentDomainDeferred.get()
            if (!parentDomain) return
            parentDomain.subdomainCount -= 1
            ctx.log.debug(`[ensRegistry] Detected domain deletion ${domain.id}`)
            ctx.esm.save(parentDomain)
            // Recursively check the parent domain for deletion.
            recurseDomainDelete(ctx, parentDomain)
        })
    }
}

function createDomain(node: string, timestamp: bigint, owner: Account): Domain {
    let domain = instantiateMinimalDomain(node, timestamp, owner)
    if (node === ROOT_NODE) {
        domain.isMigrated = true
        domain.createdAt = BigInt(0)
        domain.subdomainCount = 0
    }
    return domain
}

function createDomainIfRootNode(
    node: string,
    timestamp: bigint,
    rootNodeOwner: Account,
) {
    if (node === ROOT_NODE) {
        return createDomain(node, timestamp, rootNodeOwner)
    }
    return undefined
}

function handleNewOwner(
    ctx: CtxWithCache,
    log: Log,
    event: ReturnType<typeof abi.events.NewOwner.decode>,
    isOld: boolean = false,
) {
    ctx.log.debug(
        `[ensRegistry] NewOwner: node:${event.node} label:${event.label} owner:${event.owner} tx: ${log.transaction?.hash}`,
    )
    const nodeId = event.node.toLowerCase()
    const labelId = event.label.toLowerCase()
    const ownerId = event.owner.toLowerCase()
    const subnode = createSubnodeId(nodeId, labelId)
    const domainDeferred = ctx.esm.prepare(Domain, subnode, {
        parent: true,
        owner: true,
        resolver: true,
    })
    const parentDomainDeferred = ctx.esm.prepare(Domain, nodeId)
    const ownerAccountDeferred = ctx.esm.prepare(Account, ownerId)
    const rootNodeOwnerDeferred = ctx.esm.prepare(Account, ADDR_EMPTY)
    ctx.queue.enqueue(() => {
        let rootNodeOwner = rootNodeOwnerDeferred.get()
        if (!rootNodeOwner) {
            rootNodeOwner = new Account({id: ADDR_EMPTY})
            ctx.esm.saveForId(rootNodeOwner)
        }
        let ownerAccount = ownerAccountDeferred.get()
        if (!ownerAccount) {
            ownerAccount = new Account({id: ownerId})
            ctx.esm.saveForId(ownerAccount)
        }
        let domain =
            domainDeferred.get() ||
            createDomainIfRootNode(
                subnode,
                BigInt(log.block.timestamp / 1000),
                rootNodeOwner,
            )
        if (isOld && domain && domain.isMigrated) {
            return
        }
        if (!domain) {
            domain = createDomain(
                subnode,
                BigInt(log.block.timestamp / 1000),
                ownerAccount,
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        const parent =
            parentDomainDeferred.get() ||
            createDomainIfRootNode(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                rootNodeOwner,
            )
        if (parent && !domain.parent) {
            ctx.esm.saveForId(
                new Domain({...parent, parent: undefined, resolver: undefined}),
            )
            parent.subdomainCount++
            ctx.esm.save(parent)
        }
        if (!domain.name) {
            let labelName = labelNameByHash(domain.id)
            if (labelName) {
                domain.labelName = labelName
            } else {
                labelName = `[${labelId.slice(2)}]`
            }
            const name =
                parent && parent.id !== ROOT_NODE
                    ? `${labelName}.${parent.name}`
                    : labelName
            domain.name = name
        }
        domain.owner = ownerAccount
        domain.parent = parent
        domain.labelhash = hexToByteArray(labelId)
        domain.isMigrated = !isOld
        ctx.esm.save(domain)
        recurseDomainDelete(ctx, domain)

        // save event
        const domainEvent = instantiateEventData(NewOwner, log)
        domainEvent.domain = domain
        domainEvent.owner = ownerAccount

        if (domain.parent) {
            domainEvent.parentDomain = domain.parent
        } else {
            const parent = instantiateMinimalDomain(
                nodeId,
                BigInt(0),
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(parent)
            domainEvent.parentDomain = parent
        }
        ctx.esm.save(domainEvent)
    })
}

function handleTransfer(
    ctx: CtxWithCache,
    log: Log,
    event: ReturnType<typeof abi.events.Transfer.decode>,
    isOld: boolean = false,
) {
    ctx.log.debug(`[ensRegistryOld] Transfer: ${event.node} ${event.owner}`)
    const nodeId = event.node.toLowerCase()
    const ownerId = event.owner.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, nodeId, {
        parent: true,
        owner: true,
        resolver: true,
    })
    const ownerDeferred = ctx.esm.prepare(Account, ownerId)
    const rootNodeOwnerDeferred = ctx.esm.prepare(Account, ADDR_EMPTY)
    ctx.queue.enqueue(() => {
        let ownerAccount = ownerDeferred.get()
        if (!ownerAccount) {
            ownerAccount = new Account({id: ownerId})
            ctx.esm.saveForId(ownerAccount)
        }

        let rootNodeOwner = rootNodeOwnerDeferred.get()
        if (!rootNodeOwner) {
            rootNodeOwner = new Account({id: ADDR_EMPTY})
            ctx.esm.saveForId(rootNodeOwner)
        }
        const domain =
            domainDeferred.get() ||
            createDomainIfRootNode(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                rootNodeOwner,
            )
        if (!domain) {
            return
        }
        if (isOld && domain.isMigrated) {
            return
        }
        domain.owner = ownerAccount
        ctx.esm.save(domain)
        recurseDomainDelete(ctx, domain)
        // save event
        const domainEvent = instantiateEventData(Transfer, log)
        domainEvent.domain = domain
        domainEvent.owner = ownerAccount
        ctx.esm.save(domainEvent)
    })
}

function handleNewResolver(
    ctx: CtxWithCache,
    log: Log,
    event: ReturnType<typeof abi.events.NewResolver.decode>,
    isOld: boolean = false,
) {
    // some resolver value cant be decoded (e.g. tx: 0x96f71a1980e1b33ba7a67a56007bafdc513f5c584270e9aec14efbb7527e5fc2)
    ctx.log.debug(
        `[ensRegistryOld] NewResolver: ${event.node} ${event.resolver}`,
    )
    const nodeId = event.node.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, event.node, {
        parent: true,
        owner: true,
        resolver: true,
    })
    const _resolverId = event.resolver.toLowerCase()
    const resolverId =
        event.resolver === ADDR_EMPTY
            ? undefined
            : createResolverId(nodeId, _resolverId)
    const resolverDeferred = resolverId
        ? ctx.esm.prepare(Resolver, resolverId)
        : undefined
    const emptyResolverDeferred = ctx.esm.prepare(Resolver, ADDR_EMPTY) // for event data
    ctx.queue.enqueue(() => {
        const domain = domainDeferred.get()
        if (!domain) {
            return
        }
        if (isOld && nodeId !== ROOT_NODE && domain.isMigrated) {
            return
        }
        if (domain.id !== ADDR_EMPTY && resolverDeferred) {
            let resolver = resolverDeferred.get()
            if (!resolver) {
                resolver = new Resolver({id: resolverId})
                resolver.address = hexToByteArray(_resolverId)
                // save earlier without domain to avoid fk constraint error
                ctx.esm.saveForId(new Resolver({...resolver}))
                resolver.domain = domain
                ctx.esm.save(resolver)
                // since this is a new resolver entity,
                // there can't be a resolved address yet so set to null
                domain.resolvedAddress = null
            } else {
                domain.resolvedAddress = resolver.addr
            }
            domain.resolver = resolver
        } else {
            domain.resolver = null
            domain.resolvedAddress = null
        }
        ctx.esm.save(domain)
        recurseDomainDelete(ctx, domain)

        // save event
        const domainEvent = instantiateEventData(NewResolver, log)
        domainEvent.domain = domain
        
        if (domain.resolver) {
            domainEvent.resolver = domain.resolver
        } else {
            let emptyResolver = emptyResolverDeferred.get()
            if (!emptyResolver) {
                emptyResolver = instantiateEmptyAddrResolver()
                ctx.esm.saveForId(emptyResolver)
            }
            domainEvent.resolver = emptyResolver
        }
        
        ctx.esm.save(domainEvent)
    })
}

function handleNewTTL(
    ctx: CtxWithCache,
    log: Log,
    event: ReturnType<typeof abi.events.NewTTL.decode>,
    isOld: boolean = false,
) {
    const nodeId = event.node.toLowerCase()
    ctx.log.debug(`[ensRegistryOld] NewTTL: ${nodeId} ${event.ttl}`)
    const domainDeferred = ctx.esm.prepare(Domain, nodeId, {
        parent: true,
        owner: true,
        resolver: true,
    })
    const rootNodeOwnerDeferred = ctx.esm.prepare(Account, ADDR_EMPTY)
    ctx.queue.enqueue(() => {
        let rootNodeOwner = rootNodeOwnerDeferred.get()
        if (!rootNodeOwner) {
            rootNodeOwner = new Account({id: ADDR_EMPTY})
            ctx.esm.saveForId(rootNodeOwner)
        }
        const domain =
            domainDeferred.get() ||
            createDomainIfRootNode(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                rootNodeOwner,
            )
        if (!domain) {
            return
        }
        if (isOld && domain.isMigrated) {
            return
        }
        domain.ttl = event.ttl
        ctx.esm.save(domain)

        // save event
        const domainEvent = instantiateEventData(NewTTL, log)
        domainEvent.domain = domain
        domainEvent.ttl = event.ttl
        ctx.esm.save(domainEvent)
    })
}
