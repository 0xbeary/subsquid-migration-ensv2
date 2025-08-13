import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    Transfer: event("0xd4735d920b0f87494915f556dd9b54c8f309026070caea5c737245152564d266", "Transfer(bytes32,address)", {"node": indexed(p.bytes32), "owner": p.address}),
    NewOwner: event("0xce0457fe73731f824cc272376169235128c118b49d344817417c6d108d155e82", "NewOwner(bytes32,bytes32,address)", {"node": indexed(p.bytes32), "label": indexed(p.bytes32), "owner": p.address}),
    NewResolver: event("0x335721b01866dc23fbee8b6b2c7b1e14d6f05c28cd35a2c934239f94095602a0", "NewResolver(bytes32,address)", {"node": indexed(p.bytes32), "resolver": p.address}),
    NewTTL: event("0x1d4f9bbfc9cab89d66e1a1562f2233ccbf1308cb4f63de2ead5787adddb8fa68", "NewTTL(bytes32,uint64)", {"node": indexed(p.bytes32), "ttl": p.uint64}),
}

export const functions = {
    resolver: fun("0x0178b8bf", "resolver(bytes32)", {"node": p.bytes32}, p.address),
    owner: fun("0x02571be3", "owner(bytes32)", {"node": p.bytes32}, p.address),
    setSubnodeOwner: fun("0x06ab5923", "setSubnodeOwner(bytes32,bytes32,address)", {"node": p.bytes32, "label": p.bytes32, "owner": p.address}, ),
    setTTL: fun("0x14ab9038", "setTTL(bytes32,uint64)", {"node": p.bytes32, "ttl": p.uint64}, ),
    ttl: fun("0x16a25cbd", "ttl(bytes32)", {"node": p.bytes32}, p.uint64),
    setResolver: fun("0x1896f70a", "setResolver(bytes32,address)", {"node": p.bytes32, "resolver": p.address}, ),
    setOwner: fun("0x5b0fc9c3", "setOwner(bytes32,address)", {"node": p.bytes32, "owner": p.address}, ),
}

export class Contract extends ContractBase {
}

/// Event types
export type TransferEventArgs = EParams<typeof events.Transfer>
export type NewOwnerEventArgs = EParams<typeof events.NewOwner>
export type NewResolverEventArgs = EParams<typeof events.NewResolver>
export type NewTTLEventArgs = EParams<typeof events.NewTTL>

/// Function types
export type ResolverParams = FunctionArguments<typeof functions.resolver>
export type ResolverReturn = FunctionReturn<typeof functions.resolver>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type SetSubnodeOwnerParams = FunctionArguments<typeof functions.setSubnodeOwner>
export type SetSubnodeOwnerReturn = FunctionReturn<typeof functions.setSubnodeOwner>

export type SetTTLParams = FunctionArguments<typeof functions.setTTL>
export type SetTTLReturn = FunctionReturn<typeof functions.setTTL>

export type TtlParams = FunctionArguments<typeof functions.ttl>
export type TtlReturn = FunctionReturn<typeof functions.ttl>

export type SetResolverParams = FunctionArguments<typeof functions.setResolver>
export type SetResolverReturn = FunctionReturn<typeof functions.setResolver>

export type SetOwnerParams = FunctionArguments<typeof functions.setOwner>
export type SetOwnerReturn = FunctionReturn<typeof functions.setOwner>

