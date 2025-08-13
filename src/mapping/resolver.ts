import * as abi from '../abi/PublicResolver'
import {CtxWithCache, Log} from '../processor'
import {ADDR_EMPTY, ADDR_RESOLVER} from './share/constants'
import {createMapping} from './'
import {
    AbiChanged,
    Account,
    AddrChanged,
    AuthorisationChanged,
    ContenthashChanged,
    Domain,
    InterfaceChanged,
    MulticoinAddrChanged,
    NameChanged,
    PubkeyChanged,
    Resolver,
    TextChanged,
    VersionChanged,
} from '../model'
import {hexToByteArray} from '../utils'
import {createResolverId, instantiateEventData} from './share/entities'

const mapping = createMapping(abi, ADDR_RESOLVER)
export default mapping

mapping.handlers.handleABIChanged = (ctx, log, event) => {
    ctx.log.debug(
        `[publicResolver] ABIChanged: ${event.node} ${event.contentType}`,
    )
    const nodeId = event.node.toLowerCase()
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            ctx.esm.saveForId(resolver)
        }
        const e = instantiateEventData(AbiChanged, log)
        e.resolver = resolver
        e.contentType = event.contentType
        ctx.esm.save(e)
    })
}

mapping.handlers.handleAddrChanged = (ctx, log, event) => {
    ctx.log.debug(`[publicResolver] AddrChanged: ${event.node} ${event.a}`)
    const nodeId = event.node.toLowerCase()
    const aId = event.a.toLowerCase()
    const accDeferred = ctx.esm.prepare(Account, aId)
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let acc = accDeferred.get()
        if (!acc) {
            acc = new Account({id: aId})
            ctx.esm.saveForId(new Account({...acc}))
        }
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
                addr: acc,
            })
            // save earlier without domain to avoid fk constraint error
            ctx.esm.saveForId(new Resolver({...resolver, domain: null}))
        }
        let domain = domainDeferred.get()
        resolver.addr = acc
        resolver.domain = domain
        if (domain) {
            if (domain.id !== ADDR_EMPTY) {
                domain.resolvedAddress = acc
            }
            ctx.esm.save(domain)
        }
        ctx.esm.save(resolver)

        // save event
        const e = instantiateEventData(AddrChanged, log)
        e.resolver = resolver
        e.addr = acc
        ctx.esm.save(e)
    })
}

mapping.handlers.handleAddressChanged = (ctx, log, event) => {
    // multicoinAddrChanged
    ctx.log.debug(
        `[publicResolver] AddressChanged: ${event.node} ${event.coinType} ${event.newAddress}`,
    )
    const nodeId = event.node.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            // save earlier without domain to avoid fk constraint error
            ctx.esm.saveForId(new Resolver({...resolver, domain: null}))
        }
        let domain = domainDeferred.get()
        resolver.domain = domain
        const strCoinType = event.coinType.toString()
        if (Array.isArray(resolver.coinTypes)) {
            const coinTypes = resolver.coinTypes
            if (!coinTypes.includes(strCoinType)) {
                coinTypes.push(strCoinType)
                resolver.coinTypes = coinTypes
            }
        } else {
            resolver.coinTypes = [strCoinType]
        }
        ctx.esm.save(resolver)

        // save event
        const e = instantiateEventData(MulticoinAddrChanged, log)
        e.resolver = resolver
        e.coinType = event.coinType
        e.addr = hexToByteArray(event.newAddress)
        ctx.esm.save(e)
    })
}

mapping.handlers.handleAuthorisationChanged = (ctx, log, event) => {
    ctx.log.debug(
        `[publicResolver] AuthorisationChanged: ${event.node} ${event.owner} ${event.target} ${event.isAuthorised}`,
    )
    const nodeId = event.node.toLowerCase()
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            ctx.esm.saveForId(resolver)
        }
        ctx.esm.save(resolver)
        const e = instantiateEventData(AuthorisationChanged, log)
        e.resolver = resolver
        e.isAuthorized = event.isAuthorised
        e.target = hexToByteArray(event.target)
        e.owner = hexToByteArray(event.owner)
        ctx.esm.save(e)
    })
}

mapping.handlers.handleContenthashChanged = (ctx, log, event) => {
    ctx.log.debug(
        `[PublicResolver] ContenthashChanged: ${event.node} ${event.hash}`,
    )
    const nodeId = event.node.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            // save earlier without domain to avoid fk constraint error
            ctx.esm.saveForId(new Resolver({...resolver, domain: null}))
        }
        const domain = domainDeferred.get()
        resolver.domain = domain
        resolver.contentHash = hexToByteArray(event.hash)
        ctx.esm.save(resolver)

        // save event
        const e = instantiateEventData(ContenthashChanged, log)
        e.resolver = resolver
        e.hash = resolver.contentHash
        ctx.esm.save(e)
    })
}

mapping.handlers.handleInterfaceChanged = (ctx, log, event) => {
    ctx.log.debug(
        `[publicResolver] InterfaceChanged: ${event.node} ${event.interfaceID} ${event.implementer}`,
    )

    const nodeId = event.node.toLowerCase()
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            ctx.esm.saveForId(resolver)
        }
        ctx.esm.save(resolver)

        // event
        const e = instantiateEventData(InterfaceChanged, log)
        e.resolver = resolver
        e.implementer = hexToByteArray(event.implementer)
        e.interfaceID = hexToByteArray(event.interfaceID)
        e.interfaceID = hexToByteArray(event.interfaceID)
        ctx.esm.save(e)
    })
}

mapping.handlers.handleNameChanged = (ctx, log, event) => {
    ctx.log.debug(`[publicResolver] NameChanged: ${event.node} ${event.name}`)
    if (event.name.indexOf('\u0000') != -1) return

    const nodeId = event.node.toLowerCase()
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            ctx.esm.saveForId(resolver)
        }
        ctx.esm.save(resolver)

        // event
        const e = instantiateEventData(NameChanged, log)
        e.resolver = resolver
        e.name = event.name
        ctx.esm.save(e)
    })
}

mapping.handlers.handlePubkeyChanged = (ctx: CtxWithCache, log: Log, event) => {
    ctx.log.debug(
        `[publicResolver] PubkeyChanged: ${event.node} ${event.x} ${event.y}`,
    )
    const nodeId = event.node.toLowerCase()
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            ctx.esm.saveForId(resolver)
        }
        ctx.esm.save(resolver)

        // event
        const e = instantiateEventData(PubkeyChanged, log)
        e.resolver = resolver
        e.x = hexToByteArray(event.x)
        e.y = hexToByteArray(event.y)
        ctx.esm.save(e)
    })
}

mapping.handlers['handleTextChanged(bytes32 indexed,string indexed,string)'] = (
    ctx,
    log,
    event,
) => {
    const {node, indexedKey, key} = event
    ctx.log.debug(`[publicResolver] TextChanged: ${node} ${indexedKey} ${key}`)
    return handleTextChanged(ctx, log, node, key)
}

mapping.handlers['handleTextChanged(bytes32 indexed,string indexed,string,string)'] = (
    ctx,
    log,
    event,
) => {
    const {node, indexedKey, key, value} = event
    ctx.log.debug(
        `[publicResolver] TextChanged: ${node} ${indexedKey} ${key} ${value}`,
    )
    return handleTextChanged(ctx, log, node, key, value)
}

function handleTextChanged(
    ctx: CtxWithCache,
    log: Log,
    node: string,
    key: string,
    value?: string,
) {
    node = node.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, node)
    const resolverId = createResolverId(node, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                address: hexToByteArray(log.address),
            })
            // save earlier without domain to avoid fk constraint error
            ctx.esm.saveForId(new Resolver({...resolver, domain: null}))
        }
        const domain = domainDeferred.get()
        resolver.domain = domain
        if (Array.isArray(resolver.texts)) {
            if (!resolver.texts.includes(key)) {
                resolver.texts.push(key)
            }
        } else {
            resolver.texts = [key]
        }
        ctx.esm.save(resolver)

        // event
        const e = instantiateEventData(TextChanged, log)
        e.resolver = resolver
        e.key = key
        e.value = value
        ctx.esm.save(e)
    })
}

mapping.handlers.handleVersionChanged = (ctx, log, event) => {
    ctx.log.debug(
        `[publicResolver] VersionChanged: ${event.node} ${event.newVersion}`,
    )
    const nodeId = event.node.toLowerCase()
    const domainDeferred = ctx.esm.prepare(Domain, nodeId, {
        resolver: true,
    })
    const resolverId = createResolverId(nodeId, log.address)
    const resolverDeferred = ctx.esm.prepare(Resolver, resolverId)
    ctx.queue.enqueue(() => {
        const domain = domainDeferred.get()
        if (domain && domain.resolver?.id === resolverId) {
            domain.resolvedAddress = null
            ctx.esm.save(domain)
        }
        let resolver = resolverDeferred.get()
        if (!resolver) {
            resolver = new Resolver({
                id: resolverId,
                domain,
                address: hexToByteArray(log.address),
            })
            // save earlier without domain to avoid fk constraint error
            ctx.esm.saveForId(new Resolver({...resolver, domain: null}))
        }
        resolver.domain = domain
        resolver.addr = null
        resolver.contentHash = null
        resolver.texts = null
        resolver.coinTypes = null
        ctx.esm.save(resolver)

        // event
        const e = instantiateEventData(VersionChanged, log)
        e.resolver = resolver
        e.version = event.newVersion
        ctx.esm.save(e)
    })
}
