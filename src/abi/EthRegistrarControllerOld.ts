import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NameRegistered: event("0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f", "NameRegistered(string,bytes32,address,uint256,uint256)", {"name": p.string, "label": indexed(p.bytes32), "owner": indexed(p.address), "cost": p.uint256, "expires": p.uint256}),
    NameRenewed: event("0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae", "NameRenewed(string,bytes32,uint256,uint256)", {"name": p.string, "label": indexed(p.bytes32), "cost": p.uint256, "expires": p.uint256}),
    NewPriceOracle: event("0xf261845a790fe29bbd6631e2ca4a5bdc83e6eed7c3271d9590d97287e00e9123", "NewPriceOracle(address)", {"oracle": indexed(p.address)}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceID": p.bytes4}, p.bool),
    withdraw: fun("0x3ccfd60b", "withdraw()", {}, ),
    setPriceOracle: fun("0x530e784f", "setPriceOracle(address)", {"_prices": p.address}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setCommitmentAges: fun("0x7e324479", "setCommitmentAges(uint256,uint256)", {"_minCommitmentAge": p.uint256, "_maxCommitmentAge": p.uint256}, ),
    commitments: viewFun("0x839df945", "commitments(bytes32)", {"_0": p.bytes32}, p.uint256),
    rentPrice: viewFun("0x83e7f6ff", "rentPrice(string,uint256)", {"name": p.string, "duration": p.uint256}, p.uint256),
    register: fun("0x85f6d155", "register(string,address,uint256,bytes32)", {"name": p.string, "owner": p.address, "duration": p.uint256, "secret": p.bytes32}, ),
    MIN_REGISTRATION_DURATION: viewFun("0x8a95b09f", "MIN_REGISTRATION_DURATION()", {}, p.uint256),
    minCommitmentAge: viewFun("0x8d839ffe", "minCommitmentAge()", {}, p.uint256),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    isOwner: viewFun("0x8f32d59b", "isOwner()", {}, p.bool),
    valid: viewFun("0x9791c097", "valid(string)", {"name": p.string}, p.bool),
    renew: fun("0xacf1a841", "renew(string,uint256)", {"name": p.string, "duration": p.uint256}, ),
    available: viewFun("0xaeb8ce9b", "available(string)", {"name": p.string}, p.bool),
    maxCommitmentAge: viewFun("0xce1e09c0", "maxCommitmentAge()", {}, p.uint256),
    commit: fun("0xf14fcbc8", "commit(bytes32)", {"commitment": p.bytes32}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    makeCommitment: viewFun("0xf49826be", "makeCommitment(string,address,bytes32)", {"name": p.string, "owner": p.address, "secret": p.bytes32}, p.bytes32),
}

export class Contract extends ContractBase {

    supportsInterface(interfaceID: SupportsInterfaceParams["interfaceID"]) {
        return this.eth_call(functions.supportsInterface, {interfaceID})
    }

    commitments(_0: CommitmentsParams["_0"]) {
        return this.eth_call(functions.commitments, {_0})
    }

    rentPrice(name: RentPriceParams["name"], duration: RentPriceParams["duration"]) {
        return this.eth_call(functions.rentPrice, {name, duration})
    }

    MIN_REGISTRATION_DURATION() {
        return this.eth_call(functions.MIN_REGISTRATION_DURATION, {})
    }

    minCommitmentAge() {
        return this.eth_call(functions.minCommitmentAge, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    isOwner() {
        return this.eth_call(functions.isOwner, {})
    }

    valid(name: ValidParams["name"]) {
        return this.eth_call(functions.valid, {name})
    }

    available(name: AvailableParams["name"]) {
        return this.eth_call(functions.available, {name})
    }

    maxCommitmentAge() {
        return this.eth_call(functions.maxCommitmentAge, {})
    }

    makeCommitment(name: MakeCommitmentParams["name"], owner: MakeCommitmentParams["owner"], secret: MakeCommitmentParams["secret"]) {
        return this.eth_call(functions.makeCommitment, {name, owner, secret})
    }
}

/// Event types
export type NameRegisteredEventArgs = EParams<typeof events.NameRegistered>
export type NameRenewedEventArgs = EParams<typeof events.NameRenewed>
export type NewPriceOracleEventArgs = EParams<typeof events.NewPriceOracle>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

export type SetPriceOracleParams = FunctionArguments<typeof functions.setPriceOracle>
export type SetPriceOracleReturn = FunctionReturn<typeof functions.setPriceOracle>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetCommitmentAgesParams = FunctionArguments<typeof functions.setCommitmentAges>
export type SetCommitmentAgesReturn = FunctionReturn<typeof functions.setCommitmentAges>

export type CommitmentsParams = FunctionArguments<typeof functions.commitments>
export type CommitmentsReturn = FunctionReturn<typeof functions.commitments>

export type RentPriceParams = FunctionArguments<typeof functions.rentPrice>
export type RentPriceReturn = FunctionReturn<typeof functions.rentPrice>

export type RegisterParams = FunctionArguments<typeof functions.register>
export type RegisterReturn = FunctionReturn<typeof functions.register>

export type MIN_REGISTRATION_DURATIONParams = FunctionArguments<typeof functions.MIN_REGISTRATION_DURATION>
export type MIN_REGISTRATION_DURATIONReturn = FunctionReturn<typeof functions.MIN_REGISTRATION_DURATION>

export type MinCommitmentAgeParams = FunctionArguments<typeof functions.minCommitmentAge>
export type MinCommitmentAgeReturn = FunctionReturn<typeof functions.minCommitmentAge>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type IsOwnerParams = FunctionArguments<typeof functions.isOwner>
export type IsOwnerReturn = FunctionReturn<typeof functions.isOwner>

export type ValidParams = FunctionArguments<typeof functions.valid>
export type ValidReturn = FunctionReturn<typeof functions.valid>

export type RenewParams = FunctionArguments<typeof functions.renew>
export type RenewReturn = FunctionReturn<typeof functions.renew>

export type AvailableParams = FunctionArguments<typeof functions.available>
export type AvailableReturn = FunctionReturn<typeof functions.available>

export type MaxCommitmentAgeParams = FunctionArguments<typeof functions.maxCommitmentAge>
export type MaxCommitmentAgeReturn = FunctionReturn<typeof functions.maxCommitmentAge>

export type CommitParams = FunctionArguments<typeof functions.commit>
export type CommitReturn = FunctionReturn<typeof functions.commit>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type MakeCommitmentParams = FunctionArguments<typeof functions.makeCommitment>
export type MakeCommitmentReturn = FunctionReturn<typeof functions.makeCommitment>

