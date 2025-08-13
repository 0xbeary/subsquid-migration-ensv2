import * as abi from '../abi/BaseRegistrar'
import {ADDR_BASE_REGISTRAR, ADDR_EMPTY, ADDR_ETH_NODE} from './share/constants'
import {createMapping} from './'
import {
    Account,
    Domain,
    NameRegistered,
    NameRenewed,
    NameTransferred,
    Registration,
} from '../model'
import {uint256ToHex} from '../utils'
import {
    createSubnodeId,
    instantiateEventData,
    instantiateMinimalDomain,
    labelNameByHash,
} from './share/entities'

const ROOT_NODE = ADDR_ETH_NODE
const GRACE_PERIOD_SECONDS = 7776000
const mapping = createMapping(abi, ADDR_BASE_REGISTRAR)
export default mapping

mapping.handlers.handleTransfer = (ctx, log, event) => {
    ctx.log.debug(
        `[baseRegistrar] Transfer: ${event.from} ${event.to} ${event.tokenId}`,
    )
    const toId = event.to.toLowerCase()
    const accToDeferred = ctx.esm.prepare(Account, toId)
    const label = uint256ToHex(event.tokenId)
    const registrationDeferred = ctx.esm.prepare(Registration, label)
    const domainId = createSubnodeId(ROOT_NODE, label)
    const domainDeferred = ctx.esm.prepare(Domain, domainId)
    ctx.queue.enqueue(() => {
        const registration = registrationDeferred.get()
        if (!registration) {
            return
        }
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                domainId,
                BigInt(log.block.timestamp / 1000),
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        let accTo = accToDeferred.get()
        if (!accTo) {
            accTo = new Account({id: toId})
            ctx.esm.saveForId(accTo)
        }
        registration.registrant = accTo
        domain.registrant = accTo
        ctx.esm.save(domain)
        ctx.esm.save(registration)

        const regEvent = instantiateEventData(NameTransferred, log)
        regEvent.registration = registration
        regEvent.newOwner = accTo
        ctx.esm.save(regEvent)
    })
}

mapping.handlers.handleNameRegistered = (ctx, log, event) => {
    ctx.log.debug(
        `[baseRegistrar] NameRegistered: ${event.id} ${event.owner} ${event.expires}`,
    )
    const ownerId = event.owner.toLowerCase()
    const ownerAccDeferred = ctx.esm.prepare(Account, ownerId)
    const label = uint256ToHex(event.id)
    const domainId = createSubnodeId(ROOT_NODE, label)
    const domainDeferred = ctx.esm.prepare(Domain, domainId)
    ctx.queue.enqueue(() => {
        let account = ownerAccDeferred.get()
        if (!account) {
            account = new Account({id: ownerId})
            ctx.esm.saveForId(account)
        }
        const registration = new Registration({id: label})
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                domainId,
                BigInt(log.block.timestamp / 1000),
                account,
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        registration.domain = domain
        registration.registrationDate = BigInt(log.block.timestamp / 1000)
        registration.expiryDate = event.expires
        registration.registrant = account
        domain.registrant = account
        domain.expiryDate = event.expires + BigInt(GRACE_PERIOD_SECONDS)
        let labelName = domain.labelName
        if (!labelName) {
            const name = labelNameByHash(label)
            if (name) {
                registration.labelName = name
            } else {
                labelName = `[${label.slice(2)}]`
            }
        }
        if (!domain.name) {
            domain.name = `${labelName}.eth`
        }
        ctx.esm.save(domain)
        ctx.esm.save(registration)

        // save event
        const regEvent = instantiateEventData(NameRegistered, log)
        regEvent.registration = registration
        regEvent.registrant = account
        regEvent.expiryDate = event.expires
        ctx.esm.save(regEvent)
    })
}

mapping.handlers.handleNameRenewed = (ctx, log, event) => {
    ctx.log.debug(`[baseRegistrar] NameRenewed: ${event.id} ${event.expires}`)
    const label = uint256ToHex(event.id)
    const registrationDeferred = ctx.esm.prepare(Registration, label)
    const domainId = createSubnodeId(ROOT_NODE, label)
    const domainDeferred = ctx.esm.prepare(Domain, domainId)
    ctx.queue.enqueue(() => {
        const registration = registrationDeferred.get()
        if (!registration) {
            return
        }
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                domainId,
                BigInt(log.block.timestamp / 1000),
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        registration.domain = domain
        registration.expiryDate = event.expires
        domain.expiryDate = event.expires + BigInt(GRACE_PERIOD_SECONDS)
        ctx.esm.save(domain)
        ctx.esm.save(registration)

        // save event
        const regEvent = instantiateEventData(NameRenewed, log)
        regEvent.registration = registration
        regEvent.expiryDate = event.expires
        ctx.esm.save(regEvent)
    })
}
