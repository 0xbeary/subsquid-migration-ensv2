import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    OwnerChanged: event("0xa2ea9883a321a3e97b8266c2b078bfeec6d50c711ed71f874a90d500ae2eaf36", "OwnerChanged(address)", {"newOwner": p.address}),
    DeedClosed: event("0xbb2ce2f51803bba16bc85282b47deeea9a5c6223eabea1077be696b3f265cf13", "DeedClosed()", {}),
}

export const functions = {
    creationDate: fun("0x05b34410", "creationDate()", {}, p.uint256),
    destroyDeed: fun("0x0b5ab3d5", "destroyDeed()", {}, ),
    setOwner: fun("0x13af4035", "setOwner(address)", {"newOwner": p.address}, ),
    registrar: fun("0x2b20e397", "registrar()", {}, p.address),
    value: fun("0x3fa4f245", "value()", {}, p.uint256),
    previousOwner: fun("0x674f220f", "previousOwner()", {}, p.address),
    owner: fun("0x8da5cb5b", "owner()", {}, p.address),
    setBalance: fun("0xb0c80972", "setBalance(uint256,bool)", {"newValue": p.uint256, "throwOnFailure": p.bool}, ),
    closeDeed: fun("0xbbe42771", "closeDeed(uint256)", {"refundRatio": p.uint256}, ),
    setRegistrar: fun("0xfaab9d39", "setRegistrar(address)", {"newRegistrar": p.address}, ),
}

export class Contract extends ContractBase {
}

/// Event types
export type OwnerChangedEventArgs = EParams<typeof events.OwnerChanged>
export type DeedClosedEventArgs = EParams<typeof events.DeedClosed>

/// Function types
export type CreationDateParams = FunctionArguments<typeof functions.creationDate>
export type CreationDateReturn = FunctionReturn<typeof functions.creationDate>

export type DestroyDeedParams = FunctionArguments<typeof functions.destroyDeed>
export type DestroyDeedReturn = FunctionReturn<typeof functions.destroyDeed>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

export type RegistrarParams = FunctionArguments<typeof functions.registrar>
export type RegistrarReturn = FunctionReturn<typeof functions.registrar>

export type ValueParams = FunctionArguments<typeof functions.value>
export type ValueReturn = FunctionReturn<typeof functions.value>

export type PreviousOwnerParams = FunctionArguments<typeof functions.previousOwner>
export type PreviousOwnerReturn = FunctionReturn<typeof functions.previousOwner>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type SetBalanceParams = FunctionArguments<typeof functions.setBalance>
export type SetBalanceReturn = FunctionReturn<typeof functions.setBalance>

export type CloseDeedParams = FunctionArguments<typeof functions.closeDeed>
export type CloseDeedReturn = FunctionReturn<typeof functions.closeDeed>

export type SetRegistrarParams = FunctionArguments<typeof functions.setRegistrar>
export type SetRegistrarReturn = FunctionReturn<typeof functions.setRegistrar>

