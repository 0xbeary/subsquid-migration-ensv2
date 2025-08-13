import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuctionStarted: event("0x87e97e825a1d1fa0c54e1d36c7506c1dea8b1efd451fe68b000cf96f7cf40003", "AuctionStarted(bytes32,uint256)", {"hash": indexed(p.bytes32), "registrationDate": p.uint256}),
    NewBid: event("0xb556ff269c1b6714f432c36431e2041d28436a73b6c3f19c021827bbdc6bfc29", "NewBid(bytes32,address,uint256)", {"hash": indexed(p.bytes32), "bidder": indexed(p.address), "deposit": p.uint256}),
    BidRevealed: event("0x7b6c4b278d165a6b33958f8ea5dfb00c8c9d4d0acf1985bef5d10786898bc3e7", "BidRevealed(bytes32,address,uint256,uint8)", {"hash": indexed(p.bytes32), "owner": indexed(p.address), "value": p.uint256, "status": p.uint8}),
    HashRegistered: event("0x0f0c27adfd84b60b6f456b0e87cdccb1e5fb9603991588d87fa99f5b6b61e670", "HashRegistered(bytes32,address,uint256,uint256)", {"hash": indexed(p.bytes32), "owner": indexed(p.address), "value": p.uint256, "registrationDate": p.uint256}),
    HashReleased: event("0x292b79b9246fa2c8e77d3fe195b251f9cb839d7d038e667c069ee7708c631e16", "HashReleased(bytes32,uint256)", {"hash": indexed(p.bytes32), "value": p.uint256}),
    HashInvalidated: event("0x1f9c649fe47e58bb60f4e52f0d90e4c47a526c9f90c5113df842c025970b66ad", "HashInvalidated(bytes32,string,uint256,uint256)", {"hash": indexed(p.bytes32), "name": indexed(p.string), "value": p.uint256, "registrationDate": p.uint256}),
}

export const functions = {
    releaseDeed: fun("0x0230a07c", "releaseDeed(bytes32)", {"_hash": p.bytes32}, ),
    getAllowedTime: fun("0x13c89a8f", "getAllowedTime(bytes32)", {"_hash": p.bytes32}, p.uint256),
    invalidateName: fun("0x15f73331", "invalidateName(string)", {"unhashedName": p.string}, ),
    shaBid: fun("0x22ec1244", "shaBid(bytes32,address,uint256,bytes32)", {"hash": p.bytes32, "owner": p.address, "value": p.uint256, "salt": p.bytes32}, p.bytes32),
    cancelBid: fun("0x2525f5c1", "cancelBid(address,bytes32)", {"bidder": p.address, "seal": p.bytes32}, ),
    entries: fun("0x267b6922", "entries(bytes32)", {"_hash": p.bytes32}, {"_0": p.uint8, "_1": p.address, "_2": p.uint256, "_3": p.uint256, "_4": p.uint256}),
    ens: fun("0x3f15457f", "ens()", {}, p.address),
    unsealBid: fun("0x47872b42", "unsealBid(bytes32,uint256,bytes32)", {"_hash": p.bytes32, "_value": p.uint256, "_salt": p.bytes32}, ),
    transferRegistrars: fun("0x5ddae283", "transferRegistrars(bytes32)", {"_hash": p.bytes32}, ),
    sealedBids: fun("0x5e431709", "sealedBids(address,bytes32)", {"_0": p.address, "_1": p.bytes32}, p.address),
    state: fun("0x61d585da", "state(bytes32)", {"_hash": p.bytes32}, p.uint8),
    transfer: fun("0x79ce9fac", "transfer(bytes32,address)", {"_hash": p.bytes32, "newOwner": p.address}, ),
    isAllowed: fun("0x93503337", "isAllowed(bytes32,uint256)", {"_hash": p.bytes32, "_timestamp": p.uint256}, p.bool),
    finalizeAuction: fun("0x983b94fb", "finalizeAuction(bytes32)", {"_hash": p.bytes32}, ),
    registryStarted: fun("0x9c67f06f", "registryStarted()", {}, p.uint256),
    launchLength: fun("0xae1a0b0c", "launchLength()", {}, p.uint32),
    newBid: fun("0xce92dced", "newBid(bytes32)", {"sealedBid": p.bytes32}, ),
    eraseNode: fun("0xde10f04b", "eraseNode(bytes32[])", {"labels": p.array(p.bytes32)}, ),
    startAuctions: fun("0xe27fe50f", "startAuctions(bytes32[])", {"_hashes": p.array(p.bytes32)}, ),
    acceptRegistrarTransfer: fun("0xea9e107a", "acceptRegistrarTransfer(bytes32,address,uint256)", {"hash": p.bytes32, "deed": p.address, "registrationDate": p.uint256}, ),
    startAuction: fun("0xede8acdb", "startAuction(bytes32)", {"_hash": p.bytes32}, ),
    rootNode: fun("0xfaff50a8", "rootNode()", {}, p.bytes32),
    startAuctionsAndBid: fun("0xfebefd61", "startAuctionsAndBid(bytes32[],bytes32)", {"hashes": p.array(p.bytes32), "sealedBid": p.bytes32}, ),
}

export class Contract extends ContractBase {
}

/// Event types
export type AuctionStartedEventArgs = EParams<typeof events.AuctionStarted>
export type NewBidEventArgs = EParams<typeof events.NewBid>
export type BidRevealedEventArgs = EParams<typeof events.BidRevealed>
export type HashRegisteredEventArgs = EParams<typeof events.HashRegistered>
export type HashReleasedEventArgs = EParams<typeof events.HashReleased>
export type HashInvalidatedEventArgs = EParams<typeof events.HashInvalidated>

/// Function types
export type ReleaseDeedParams = FunctionArguments<typeof functions.releaseDeed>
export type ReleaseDeedReturn = FunctionReturn<typeof functions.releaseDeed>

export type GetAllowedTimeParams = FunctionArguments<typeof functions.getAllowedTime>
export type GetAllowedTimeReturn = FunctionReturn<typeof functions.getAllowedTime>

export type InvalidateNameParams = FunctionArguments<typeof functions.invalidateName>
export type InvalidateNameReturn = FunctionReturn<typeof functions.invalidateName>

export type ShaBidParams = FunctionArguments<typeof functions.shaBid>
export type ShaBidReturn = FunctionReturn<typeof functions.shaBid>

export type CancelBidParams = FunctionArguments<typeof functions.cancelBid>
export type CancelBidReturn = FunctionReturn<typeof functions.cancelBid>

export type EntriesParams = FunctionArguments<typeof functions.entries>
export type EntriesReturn = FunctionReturn<typeof functions.entries>

export type EnsParams = FunctionArguments<typeof functions.ens>
export type EnsReturn = FunctionReturn<typeof functions.ens>

export type UnsealBidParams = FunctionArguments<typeof functions.unsealBid>
export type UnsealBidReturn = FunctionReturn<typeof functions.unsealBid>

export type TransferRegistrarsParams = FunctionArguments<typeof functions.transferRegistrars>
export type TransferRegistrarsReturn = FunctionReturn<typeof functions.transferRegistrars>

export type SealedBidsParams = FunctionArguments<typeof functions.sealedBids>
export type SealedBidsReturn = FunctionReturn<typeof functions.sealedBids>

export type StateParams = FunctionArguments<typeof functions.state>
export type StateReturn = FunctionReturn<typeof functions.state>

export type TransferParams = FunctionArguments<typeof functions.transfer>
export type TransferReturn = FunctionReturn<typeof functions.transfer>

export type IsAllowedParams = FunctionArguments<typeof functions.isAllowed>
export type IsAllowedReturn = FunctionReturn<typeof functions.isAllowed>

export type FinalizeAuctionParams = FunctionArguments<typeof functions.finalizeAuction>
export type FinalizeAuctionReturn = FunctionReturn<typeof functions.finalizeAuction>

export type RegistryStartedParams = FunctionArguments<typeof functions.registryStarted>
export type RegistryStartedReturn = FunctionReturn<typeof functions.registryStarted>

export type LaunchLengthParams = FunctionArguments<typeof functions.launchLength>
export type LaunchLengthReturn = FunctionReturn<typeof functions.launchLength>

export type NewBidParams = FunctionArguments<typeof functions.newBid>
export type NewBidReturn = FunctionReturn<typeof functions.newBid>

export type EraseNodeParams = FunctionArguments<typeof functions.eraseNode>
export type EraseNodeReturn = FunctionReturn<typeof functions.eraseNode>

export type StartAuctionsParams = FunctionArguments<typeof functions.startAuctions>
export type StartAuctionsReturn = FunctionReturn<typeof functions.startAuctions>

export type AcceptRegistrarTransferParams = FunctionArguments<typeof functions.acceptRegistrarTransfer>
export type AcceptRegistrarTransferReturn = FunctionReturn<typeof functions.acceptRegistrarTransfer>

export type StartAuctionParams = FunctionArguments<typeof functions.startAuction>
export type StartAuctionReturn = FunctionReturn<typeof functions.startAuction>

export type RootNodeParams = FunctionArguments<typeof functions.rootNode>
export type RootNodeReturn = FunctionReturn<typeof functions.rootNode>

export type StartAuctionsAndBidParams = FunctionArguments<typeof functions.startAuctionsAndBid>
export type StartAuctionsAndBidReturn = FunctionReturn<typeof functions.startAuctionsAndBid>

