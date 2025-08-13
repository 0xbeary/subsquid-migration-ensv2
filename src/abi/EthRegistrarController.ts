import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NameRegistered: event("0x69e37f151eb98a09618ddaa80c8cfaf1ce5996867c489f45b555b412271ebf27", "NameRegistered(string,bytes32,address,uint256,uint256,uint256)", {"name": p.string, "label": indexed(p.bytes32), "owner": indexed(p.address), "baseCost": p.uint256, "premium": p.uint256, "expires": p.uint256}),
    NameRenewed: event("0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae", "NameRenewed(string,bytes32,uint256,uint256)", {"name": p.string, "label": indexed(p.bytes32), "cost": p.uint256, "expires": p.uint256}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
}

export const functions = {
    MIN_REGISTRATION_DURATION: viewFun("0x8a95b09f", "MIN_REGISTRATION_DURATION()", {}, p.uint256),
    available: viewFun("0xaeb8ce9b", "available(string)", {"name": p.string}, p.bool),
    commit: fun("0xf14fcbc8", "commit(bytes32)", {"commitment": p.bytes32}, ),
    commitments: viewFun("0x839df945", "commitments(bytes32)", {"_0": p.bytes32}, p.uint256),
    makeCommitment: viewFun("0x65a69dcf", "makeCommitment(string,address,uint256,bytes32,address,bytes[],bool,uint16)", {"name": p.string, "owner": p.address, "duration": p.uint256, "secret": p.bytes32, "resolver": p.address, "data": p.array(p.bytes), "reverseRecord": p.bool, "ownerControlledFuses": p.uint16}, p.bytes32),
    maxCommitmentAge: viewFun("0xce1e09c0", "maxCommitmentAge()", {}, p.uint256),
    minCommitmentAge: viewFun("0x8d839ffe", "minCommitmentAge()", {}, p.uint256),
    nameWrapper: viewFun("0xa8e5fbc0", "nameWrapper()", {}, p.address),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    prices: viewFun("0xd3419bf3", "prices()", {}, p.address),
    recoverFunds: fun("0x5d3590d5", "recoverFunds(address,address,uint256)", {"_token": p.address, "_to": p.address, "_amount": p.uint256}, ),
    register: fun("0x74694a2b", "register(string,address,uint256,bytes32,address,bytes[],bool,uint16)", {"name": p.string, "owner": p.address, "duration": p.uint256, "secret": p.bytes32, "resolver": p.address, "data": p.array(p.bytes), "reverseRecord": p.bool, "ownerControlledFuses": p.uint16}, ),
    renew: fun("0xacf1a841", "renew(string,uint256)", {"name": p.string, "duration": p.uint256}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    rentPrice: viewFun("0x83e7f6ff", "rentPrice(string,uint256)", {"name": p.string, "duration": p.uint256}, p.struct({"base": p.uint256, "premium": p.uint256})),
    reverseRegistrar: viewFun("0x80869853", "reverseRegistrar()", {}, p.address),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceID": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    valid: viewFun("0x9791c097", "valid(string)", {"name": p.string}, p.bool),
    withdraw: fun("0x3ccfd60b", "withdraw()", {}, ),
}

export class Contract extends ContractBase {

    MIN_REGISTRATION_DURATION() {
        return this.eth_call(functions.MIN_REGISTRATION_DURATION, {})
    }

    available(name: AvailableParams["name"]) {
        return this.eth_call(functions.available, {name})
    }

    commitments(_0: CommitmentsParams["_0"]) {
        return this.eth_call(functions.commitments, {_0})
    }

    makeCommitment(name: MakeCommitmentParams["name"], owner: MakeCommitmentParams["owner"], duration: MakeCommitmentParams["duration"], secret: MakeCommitmentParams["secret"], resolver: MakeCommitmentParams["resolver"], data: MakeCommitmentParams["data"], reverseRecord: MakeCommitmentParams["reverseRecord"], ownerControlledFuses: MakeCommitmentParams["ownerControlledFuses"]) {
        return this.eth_call(functions.makeCommitment, {name, owner, duration, secret, resolver, data, reverseRecord, ownerControlledFuses})
    }

    maxCommitmentAge() {
        return this.eth_call(functions.maxCommitmentAge, {})
    }

    minCommitmentAge() {
        return this.eth_call(functions.minCommitmentAge, {})
    }

    nameWrapper() {
        return this.eth_call(functions.nameWrapper, {})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    prices() {
        return this.eth_call(functions.prices, {})
    }

    rentPrice(name: RentPriceParams["name"], duration: RentPriceParams["duration"]) {
        return this.eth_call(functions.rentPrice, {name, duration})
    }

    reverseRegistrar() {
        return this.eth_call(functions.reverseRegistrar, {})
    }

    supportsInterface(interfaceID: SupportsInterfaceParams["interfaceID"]) {
        return this.eth_call(functions.supportsInterface, {interfaceID})
    }

    valid(name: ValidParams["name"]) {
        return this.eth_call(functions.valid, {name})
    }
}

/// Event types
export type NameRegisteredEventArgs = EParams<typeof events.NameRegistered>
export type NameRenewedEventArgs = EParams<typeof events.NameRenewed>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>

/// Function types
export type MIN_REGISTRATION_DURATIONParams = FunctionArguments<typeof functions.MIN_REGISTRATION_DURATION>
export type MIN_REGISTRATION_DURATIONReturn = FunctionReturn<typeof functions.MIN_REGISTRATION_DURATION>

export type AvailableParams = FunctionArguments<typeof functions.available>
export type AvailableReturn = FunctionReturn<typeof functions.available>

export type CommitParams = FunctionArguments<typeof functions.commit>
export type CommitReturn = FunctionReturn<typeof functions.commit>

export type CommitmentsParams = FunctionArguments<typeof functions.commitments>
export type CommitmentsReturn = FunctionReturn<typeof functions.commitments>

export type MakeCommitmentParams = FunctionArguments<typeof functions.makeCommitment>
export type MakeCommitmentReturn = FunctionReturn<typeof functions.makeCommitment>

export type MaxCommitmentAgeParams = FunctionArguments<typeof functions.maxCommitmentAge>
export type MaxCommitmentAgeReturn = FunctionReturn<typeof functions.maxCommitmentAge>

export type MinCommitmentAgeParams = FunctionArguments<typeof functions.minCommitmentAge>
export type MinCommitmentAgeReturn = FunctionReturn<typeof functions.minCommitmentAge>

export type NameWrapperParams = FunctionArguments<typeof functions.nameWrapper>
export type NameWrapperReturn = FunctionReturn<typeof functions.nameWrapper>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type PricesParams = FunctionArguments<typeof functions.prices>
export type PricesReturn = FunctionReturn<typeof functions.prices>

export type RecoverFundsParams = FunctionArguments<typeof functions.recoverFunds>
export type RecoverFundsReturn = FunctionReturn<typeof functions.recoverFunds>

export type RegisterParams = FunctionArguments<typeof functions.register>
export type RegisterReturn = FunctionReturn<typeof functions.register>

export type RenewParams = FunctionArguments<typeof functions.renew>
export type RenewReturn = FunctionReturn<typeof functions.renew>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type RentPriceParams = FunctionArguments<typeof functions.rentPrice>
export type RentPriceReturn = FunctionReturn<typeof functions.rentPrice>

export type ReverseRegistrarParams = FunctionArguments<typeof functions.reverseRegistrar>
export type ReverseRegistrarReturn = FunctionReturn<typeof functions.reverseRegistrar>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type ValidParams = FunctionArguments<typeof functions.valid>
export type ValidReturn = FunctionReturn<typeof functions.valid>

export type WithdrawParams = FunctionArguments<typeof functions.withdraw>
export type WithdrawReturn = FunctionReturn<typeof functions.withdraw>

