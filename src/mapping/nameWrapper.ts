import * as abi from '../abi/NameWrapper'
import {ADDR_EMPTY, ADDR_NAME_WRAPPER} from './share/constants'
import {
    Account,
    Domain,
    ExpiryExtended,
    FusesSet,
    NameUnwrapped,
    NameWrapped,
    WrappedDomain,
    WrappedTransfer,
} from '../model'
import {uint256ToHex} from '../utils'
import {createMapping} from './share/mapper'
import {
    decodeName,
    instantiateEventData,
    instantiateMinimalDomain,
} from './share/entities'

const PARENT_CANNOT_CONTROL: number = 65536
const mapping = createMapping(abi, ADDR_NAME_WRAPPER)
export default mapping

function checkPccBurned(fuses: number): boolean {
    fuses = Number(fuses)
    return (fuses & PARENT_CANNOT_CONTROL) == PARENT_CANNOT_CONTROL
}

mapping.handlers.handleNameWrapped = (ctx, log, event) => {
    ctx.log.debug(
        `[nameWrapper] NameWrapped: ${event.name} ${event.node} ${event.expiry} ${event.owner} ${event.fuses}`,
    )
    const nodeId = event.node.toLowerCase()
    const ownerId = event.owner.toLowerCase()
    const [label, name] = decodeName(event.name) || [null, null]
    const ownerAccountDeferred = ctx.esm.prepare(Account, ownerId)
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)

    ctx.queue.enqueue(() => {
        let ownerAcc = ownerAccountDeferred.get()
        if (!ownerAcc) {
            ownerAcc = new Account({id: ownerId})
            ctx.esm.saveForId(ownerAcc)
        }
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                ownerAcc,
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }

        if (!domain.labelName && label) {
            domain.labelName = label
            domain.name = name
        }
        if (
            checkPccBurned(event.fuses) &&
            (!domain.expiryDate || event.expiry > domain.expiryDate)
        ) {
            domain.expiryDate = event.expiry
        }
        domain.wrappedOwner = ownerAcc
        ctx.esm.save(domain)

        const wrappedDomain = new WrappedDomain({id: nodeId})
        wrappedDomain.domain = domain
        wrappedDomain.expiryDate = event.expiry
        wrappedDomain.fuses = event.fuses
        wrappedDomain.owner = ownerAcc
        wrappedDomain.name = name
        ctx.esm.save(wrappedDomain)

        // save event
        const e = instantiateEventData(NameWrapped, log)
        e.domain = domain
        e.name = name
        e.fuses = event.fuses
        e.expiryDate = event.expiry
        e.owner = ownerAcc
        ctx.esm.save(e)
    })
}

mapping.handlers.handleNameUnwrapped = (ctx, log, event) => {
    ctx.log.debug(`[nameWrapper] NameUnwrapped: ${event.node} ${event.owner}`)

    const nodeId = event.node.toLowerCase()
    const ownerId = event.owner.toLowerCase()
    const ownerAccountDeferred = ctx.esm.prepare(Account, ownerId)
    const domainDeferred = ctx.esm.prepare(Domain, nodeId, {
        parent: true,
    })
    const wrappedDomainDeferred = ctx.esm.prepare(WrappedDomain, nodeId)

    ctx.queue.enqueue(() => {
        let ownerAcc = ownerAccountDeferred.get()
        if (!ownerAcc) {
            ownerAcc = new Account({id: ownerId})
            ctx.esm.saveForId(ownerAcc)
        }
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                ownerAcc,
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        domain.wrappedOwner = null
        domain.expiryDate = null
        ctx.esm.save(domain)

        const wrappedDomain = wrappedDomainDeferred.get()
        if (wrappedDomain) {
            ctx.esm.remove(wrappedDomain)
        }

        // save event
        const e = instantiateEventData(NameUnwrapped, log)
        e.domain = domain
        e.owner = ownerAcc
        ctx.esm.save(e)
    })
}

mapping.handlers.handleFusesSet = (ctx, log, event) => {
    ctx.log.debug(`[nameWrapper] FusesSet: ${event.node} ${event.fuses}`)
    const nodeId = event.node.toLowerCase()
    const wrappedDomainDeferred = ctx.esm.prepare(WrappedDomain, nodeId)
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)
    ctx.queue.enqueue(() => {
        const wrappedDomain = wrappedDomainDeferred.get()

        if (!wrappedDomain) {
            return
        }
        wrappedDomain.fuses = event.fuses
        ctx.esm.save(wrappedDomain)

        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }

        if (wrappedDomain.expiryDate && checkPccBurned(wrappedDomain.fuses)) {
            if (
                !domain.expiryDate ||
                wrappedDomain.expiryDate > domain.expiryDate
            ) {
                domain.expiryDate = wrappedDomain.expiryDate
                ctx.esm.save(domain)
            }
        }

        // save event
        const e = instantiateEventData(FusesSet, log)
        e.domain = domain
        e.fuses = event.fuses
        ctx.esm.save(e)
    })
}

mapping.handlers.handleExpiryExtended = (ctx, log, event) => {
    ctx.log.debug(`[nameWrapper] ExpiryExtended: ${event.node} ${event.expiry}`)
    const nodeId = event.node.toLowerCase()
    const wrappedDomainDeferred = ctx.esm.prepare(WrappedDomain, nodeId, {
        owner: true,
    })
    const domainDeferred = ctx.esm.prepare(Domain, nodeId)
    ctx.queue.enqueue(() => {
        const wrappedDomain = wrappedDomainDeferred.get()

        if (!wrappedDomain) {
            return
        }
        wrappedDomain.expiryDate = event.expiry
        ctx.esm.save(wrappedDomain)
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                nodeId,
                BigInt(log.block.timestamp / 1000),
                wrappedDomain.owner,
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }

        if (checkPccBurned(wrappedDomain.fuses)) {
            if (!domain.expiryDate || event.expiry > domain.expiryDate!) {
                domain.expiryDate = event.expiry
                ctx.esm.save(domain)
            }
        }
        // save event
        const e = instantiateEventData(ExpiryExtended, log)
        e.domain = domain
        e.expiryDate = event.expiry
        ctx.esm.save(e)
    })
}

mapping.handlers.handleTransferSingle = (ctx, log, event) => {
    ctx.log.debug(`[nameWrapper] TransferSingle: ${event}`)
    const toId = event.to.toLowerCase()
    const id = uint256ToHex(event.id)
    const domainDeferred = ctx.esm.prepare(Domain, id)
    const wrappedDomainDeferred = ctx.esm.prepare(WrappedDomain, id)
    const toAccountDeferred = ctx.esm.prepare(Account, toId)
    ctx.queue.enqueue(() => {
        let to = toAccountDeferred.get()
        if (!to) {
            to = new Account({id: toId})
            ctx.esm.saveForId(to)
        }
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                id,
                BigInt(log.block.timestamp / 1000),
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        let wrappedDomain = wrappedDomainDeferred.get()
        const r = wrappedTransfer(id, domain, wrappedDomain, to)
        ctx.esm.save(r.domain)
        ctx.esm.save(r.wrappedDomain)

        // save event
        const e = instantiateEventData(WrappedTransfer, log, (id) => `${id}-0`)
        e.domain = domain
        e.owner = to
        ctx.esm.save(e)
    })
}

mapping.handlers.handleTransferBatch = (ctx, log, event) => {
    ctx.log.debug(
        `[nameWrapper] TransferBatch: ${event.operator} ${event.from} ${event.to} ${event.ids} ${event.values}`,
    )
    const toId = event.to.toLowerCase()
    const resources = event.ids.map((id) => {
        const domainId = uint256ToHex(id)
        const domainDeferred = ctx.esm.prepare(Domain, domainId)
        const wrappedDomainDeferred = ctx.esm.prepare(WrappedDomain, domainId)
        const toAccountDeferred = ctx.esm.prepare(Account, toId)
        return {
            domainId,
            domainDeferred,
            wrappedDomainDeferred,
            toAccountDeferred,
        }
    })
    ctx.queue.enqueue(() => {
        resources.forEach((res, i) => {
            let to = res.toAccountDeferred.get()
            if (!to) {
                to = new Account({id: toId})
                ctx.esm.saveForId(to)
            }
            let domain = res.domainDeferred.get()
            if (!domain) {
                domain = instantiateMinimalDomain(
                    res.domainId,
                    BigInt(log.block.timestamp / 1000),
                    new Account({id: ADDR_EMPTY}), // for debugging
                )
                ctx.esm.saveForId(new Domain({...domain}))
            }
            let wrappedDomain = res.wrappedDomainDeferred.get()
            const r = wrappedTransfer(res.domainId, domain, wrappedDomain, to)
            ctx.esm.save(r.domain)
            ctx.esm.save(r.wrappedDomain)

            // save event
            const e = instantiateEventData(
                WrappedTransfer,
                log,
                (id) => `${id}-${i}`,
            )
            e.domain = domain
            e.owner = to
            ctx.esm.save(e)
        })
    })
}

function wrappedTransfer(
    wrappedDomainId: string,
    domain: Domain,
    wrappedDomain: WrappedDomain | undefined,
    to: Account,
) {
    if (!wrappedDomain) {
        wrappedDomain = new WrappedDomain({id: wrappedDomainId})
        wrappedDomain.domain = domain
        wrappedDomain.expiryDate = BigInt(0)
        wrappedDomain.fuses = 0
    }
    wrappedDomain.owner = to
    domain.wrappedOwner = to
    return {wrappedDomain, domain}
}
