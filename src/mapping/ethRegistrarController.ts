import * as abi from '../abi/EthRegistrarController'
import * as abiOld from '../abi/EthRegistrarControllerOld'
import {CtxWithCache} from '../processor'
import {
    ADDR_EMPTY,
    ADDR_ETH_NODE,
    ADDR_ETH_REGISTRAR_CONTROLLER,
    ADDR_ETH_REGISTRAR_CONTROLLER_OLD,
} from './share/constants'
import {createMapping} from './'
import {Account, Domain, Registration} from '../model'
import {
    checkValidLabel,
    createSubnodeId,
    instantiateMinimalDomain,
} from './share/entities'

export const mapping = createMapping(abi, ADDR_ETH_REGISTRAR_CONTROLLER)
const ROOT_NODE = ADDR_ETH_NODE
export const mappingOld = createMapping(
    abiOld,
    ADDR_ETH_REGISTRAR_CONTROLLER_OLD,
)

mapping.handlers.handleNameRegistered = (ctx, log, event) => {
    const {baseCost, owner, expires, premium, label, name} = event
    ctx.log.debug(
        `[ethRegistrarController] NameRegistered: ${baseCost} ${owner} ${expires} ${premium} ${label} ${name}`,
    )
    setNamePreimage(
        ctx,
        name,
        label,
        baseCost + premium,
        BigInt(log.block.timestamp / 1000),
    )
}
mapping.handlers.handleNameRenewed = (ctx, log, event) => {
    const {name, label, cost, expires} = event
    ctx.log.debug(
        `[ethRegistrarController] NameRenewed: ${name} ${label} ${cost} ${expires}`,
    )
    setNamePreimage(ctx, name, label, cost, BigInt(log.block.timestamp / 1000))
}
mappingOld.handlers.handleNameRegistered = (ctx, log, event) => {
    const {cost, owner, expires, label, name} = event
    ctx.log.debug(
        `[ethRegistrarControllerOld] NameRegistered: ${cost} ${owner} ${expires} ${label} ${name}`,
    )
    setNamePreimage(ctx, name, label, cost, BigInt(log.block.timestamp / 1000))
}
mappingOld.handlers.handleNameRenewed = (ctx, log, event) => {
    const {name, label, cost, expires} = event
    ctx.log.debug(
        `[ethRegistrarControllerOld] NameRenewed: ${name} ${label} ${cost} ${expires}`,
    )
    setNamePreimage(ctx, name, label, cost, BigInt(log.block.timestamp / 1000))
}

function setNamePreimage(
    ctx: CtxWithCache,
    labelName: string,
    label: string,
    cost: bigint,
    timestamp: bigint,
): void {
    if (!checkValidLabel(labelName)) {
        return
    }
    label = label.toLowerCase()
    const domainId = createSubnodeId(ROOT_NODE, label)
    const domainDeferred = ctx.esm.prepare(Domain, domainId)
    const registrationDeferred = ctx.esm.prepare(Registration, label)
    ctx.queue.enqueue(() => {
        let domain = domainDeferred.get()
        if (!domain) {
            domain = instantiateMinimalDomain(
                domainId,
                timestamp,
                new Account({id: ADDR_EMPTY}), // for debugging
            )
            ctx.esm.saveForId(new Domain({...domain}))
        }
        if (domain.labelName !== labelName) {
            domain.labelName = labelName
            domain.name = `${labelName}.eth`
            ctx.esm.save(domain)
        }

        const registration = registrationDeferred.get()
        if (!registration) return
        registration.labelName = labelName
        registration.cost = cost
        ctx.esm.save(registration)
    })
}
