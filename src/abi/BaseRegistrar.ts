import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ControllerAdded: event("0x0a8bb31534c0ed46f380cb867bd5c803a189ced9a764e30b3a4991a9901d7474", "ControllerAdded(address)", {"controller": indexed(p.address)}),
    ControllerRemoved: event("0x33d83959be2573f5453b12eb9d43b3499bc57d96bd2f067ba44803c859e81113", "ControllerRemoved(address)", {"controller": indexed(p.address)}),
    NameMigrated: event("0xea3d7e1195a15d2ddcd859b01abd4c6b960fa9f9264e499a70a90c7f0c64b717", "NameMigrated(uint256,address,uint256)", {"id": indexed(p.uint256), "owner": indexed(p.address), "expires": p.uint256}),
    NameRegistered: event("0xb3d987963d01b2f68493b4bdb130988f157ea43070d4ad840fee0466ed9370d9", "NameRegistered(uint256,address,uint256)", {"id": indexed(p.uint256), "owner": indexed(p.address), "expires": p.uint256}),
    NameRenewed: event("0x9b87a00e30f1ac65d898f070f8a3488fe60517182d0a2098e1b4b93a54aa9bd6", "NameRenewed(uint256,uint256)", {"id": indexed(p.uint256), "expires": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Transfer: event("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", {"from": indexed(p.address), "to": indexed(p.address), "tokenId": indexed(p.uint256)}),
    Approval: event("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", {"owner": indexed(p.address), "approved": indexed(p.address), "tokenId": indexed(p.uint256)}),
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"owner": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
}

export const functions = {
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceID": p.bytes4}, p.bool),
    getApproved: viewFun("0x081812fc", "getApproved(uint256)", {"tokenId": p.uint256}, p.address),
    approve: fun("0x095ea7b3", "approve(address,uint256)", {"to": p.address, "tokenId": p.uint256}, ),
    transferFrom: fun("0x23b872dd", "transferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    reclaim: fun("0x28ed4f6c", "reclaim(uint256,address)", {"id": p.uint256, "owner": p.address}, ),
    ens: viewFun("0x3f15457f", "ens()", {}, p.address),
    'safeTransferFrom(address,address,uint256)': fun("0x42842e0e", "safeTransferFrom(address,address,uint256)", {"from": p.address, "to": p.address, "tokenId": p.uint256}, ),
    transferPeriodEnds: viewFun("0x4ae05da7", "transferPeriodEnds()", {}, p.uint256),
    setResolver: fun("0x4e543b26", "setResolver(address)", {"resolver": p.address}, ),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"tokenId": p.uint256}, p.address),
    MIGRATION_LOCK_PERIOD: viewFun("0x6b1bd1c5", "MIGRATION_LOCK_PERIOD()", {}, p.uint256),
    balanceOf: viewFun("0x70a08231", "balanceOf(address)", {"owner": p.address}, p.uint256),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    isOwner: viewFun("0x8f32d59b", "isOwner()", {}, p.bool),
    available: viewFun("0x96e494e8", "available(uint256)", {"id": p.uint256}, p.bool),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"to": p.address, "approved": p.bool}, ),
    addController: fun("0xa7fc7a07", "addController(address)", {"controller": p.address}, ),
    previousRegistrar: viewFun("0xab14ec59", "previousRegistrar()", {}, p.address),
    'safeTransferFrom(address,address,uint256,bytes)': fun("0xb88d4fde", "safeTransferFrom(address,address,uint256,bytes)", {"from": p.address, "to": p.address, "tokenId": p.uint256, "_data": p.bytes}, ),
    GRACE_PERIOD: viewFun("0xc1a287e2", "GRACE_PERIOD()", {}, p.uint256),
    renew: fun("0xc475abff", "renew(uint256,uint256)", {"id": p.uint256, "duration": p.uint256}, p.uint256),
    nameExpires: viewFun("0xd6e4fa86", "nameExpires(uint256)", {"id": p.uint256}, p.uint256),
    controllers: viewFun("0xda8c229e", "controllers(address)", {"_0": p.address}, p.bool),
    baseNode: viewFun("0xddf7fcb0", "baseNode()", {}, p.bytes32),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"owner": p.address, "operator": p.address}, p.bool),
    acceptRegistrarTransfer: fun("0xea9e107a", "acceptRegistrarTransfer(bytes32,address,uint256)", {"label": p.bytes32, "deed": p.address, "_2": p.uint256}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    removeController: fun("0xf6a74ed7", "removeController(address)", {"controller": p.address}, ),
    register: fun("0xfca247ac", "register(uint256,address,uint256)", {"id": p.uint256, "owner": p.address, "duration": p.uint256}, p.uint256),
}

export class Contract extends ContractBase {

    supportsInterface(interfaceID: SupportsInterfaceParams["interfaceID"]) {
        return this.eth_call(functions.supportsInterface, {interfaceID})
    }

    getApproved(tokenId: GetApprovedParams["tokenId"]) {
        return this.eth_call(functions.getApproved, {tokenId})
    }

    ens() {
        return this.eth_call(functions.ens, {})
    }

    transferPeriodEnds() {
        return this.eth_call(functions.transferPeriodEnds, {})
    }

    ownerOf(tokenId: OwnerOfParams["tokenId"]) {
        return this.eth_call(functions.ownerOf, {tokenId})
    }

    MIGRATION_LOCK_PERIOD() {
        return this.eth_call(functions.MIGRATION_LOCK_PERIOD, {})
    }

    balanceOf(owner: BalanceOfParams["owner"]) {
        return this.eth_call(functions.balanceOf, {owner})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    isOwner() {
        return this.eth_call(functions.isOwner, {})
    }

    available(id: AvailableParams["id"]) {
        return this.eth_call(functions.available, {id})
    }

    previousRegistrar() {
        return this.eth_call(functions.previousRegistrar, {})
    }

    GRACE_PERIOD() {
        return this.eth_call(functions.GRACE_PERIOD, {})
    }

    nameExpires(id: NameExpiresParams["id"]) {
        return this.eth_call(functions.nameExpires, {id})
    }

    controllers(_0: ControllersParams["_0"]) {
        return this.eth_call(functions.controllers, {_0})
    }

    baseNode() {
        return this.eth_call(functions.baseNode, {})
    }

    isApprovedForAll(owner: IsApprovedForAllParams["owner"], operator: IsApprovedForAllParams["operator"]) {
        return this.eth_call(functions.isApprovedForAll, {owner, operator})
    }
}

/// Event types
export type ControllerAddedEventArgs = EParams<typeof events.ControllerAdded>
export type ControllerRemovedEventArgs = EParams<typeof events.ControllerRemoved>
export type NameMigratedEventArgs = EParams<typeof events.NameMigrated>
export type NameRegisteredEventArgs = EParams<typeof events.NameRegistered>
export type NameRenewedEventArgs = EParams<typeof events.NameRenewed>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TransferEventArgs = EParams<typeof events.Transfer>
export type ApprovalEventArgs = EParams<typeof events.Approval>
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>

/// Function types
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type GetApprovedParams = FunctionArguments<typeof functions.getApproved>
export type GetApprovedReturn = FunctionReturn<typeof functions.getApproved>

export type ApproveParams = FunctionArguments<typeof functions.approve>
export type ApproveReturn = FunctionReturn<typeof functions.approve>

export type TransferFromParams = FunctionArguments<typeof functions.transferFrom>
export type TransferFromReturn = FunctionReturn<typeof functions.transferFrom>

export type ReclaimParams = FunctionArguments<typeof functions.reclaim>
export type ReclaimReturn = FunctionReturn<typeof functions.reclaim>

export type EnsParams = FunctionArguments<typeof functions.ens>
export type EnsReturn = FunctionReturn<typeof functions.ens>

export type SafeTransferFromParams_0 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256)']>
export type SafeTransferFromReturn_0 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256)']>

export type TransferPeriodEndsParams = FunctionArguments<typeof functions.transferPeriodEnds>
export type TransferPeriodEndsReturn = FunctionReturn<typeof functions.transferPeriodEnds>

export type SetResolverParams = FunctionArguments<typeof functions.setResolver>
export type SetResolverReturn = FunctionReturn<typeof functions.setResolver>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type MIGRATION_LOCK_PERIODParams = FunctionArguments<typeof functions.MIGRATION_LOCK_PERIOD>
export type MIGRATION_LOCK_PERIODReturn = FunctionReturn<typeof functions.MIGRATION_LOCK_PERIOD>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type IsOwnerParams = FunctionArguments<typeof functions.isOwner>
export type IsOwnerReturn = FunctionReturn<typeof functions.isOwner>

export type AvailableParams = FunctionArguments<typeof functions.available>
export type AvailableReturn = FunctionReturn<typeof functions.available>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type AddControllerParams = FunctionArguments<typeof functions.addController>
export type AddControllerReturn = FunctionReturn<typeof functions.addController>

export type PreviousRegistrarParams = FunctionArguments<typeof functions.previousRegistrar>
export type PreviousRegistrarReturn = FunctionReturn<typeof functions.previousRegistrar>

export type SafeTransferFromParams_1 = FunctionArguments<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>
export type SafeTransferFromReturn_1 = FunctionReturn<typeof functions['safeTransferFrom(address,address,uint256,bytes)']>

export type GRACE_PERIODParams = FunctionArguments<typeof functions.GRACE_PERIOD>
export type GRACE_PERIODReturn = FunctionReturn<typeof functions.GRACE_PERIOD>

export type RenewParams = FunctionArguments<typeof functions.renew>
export type RenewReturn = FunctionReturn<typeof functions.renew>

export type NameExpiresParams = FunctionArguments<typeof functions.nameExpires>
export type NameExpiresReturn = FunctionReturn<typeof functions.nameExpires>

export type ControllersParams = FunctionArguments<typeof functions.controllers>
export type ControllersReturn = FunctionReturn<typeof functions.controllers>

export type BaseNodeParams = FunctionArguments<typeof functions.baseNode>
export type BaseNodeReturn = FunctionReturn<typeof functions.baseNode>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type AcceptRegistrarTransferParams = FunctionArguments<typeof functions.acceptRegistrarTransfer>
export type AcceptRegistrarTransferReturn = FunctionReturn<typeof functions.acceptRegistrarTransfer>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type RemoveControllerParams = FunctionArguments<typeof functions.removeController>
export type RemoveControllerReturn = FunctionReturn<typeof functions.removeController>

export type RegisterParams = FunctionArguments<typeof functions.register>
export type RegisterReturn = FunctionReturn<typeof functions.register>

