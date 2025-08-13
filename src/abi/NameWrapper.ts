import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ApprovalForAll: event("0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31", "ApprovalForAll(address,address,bool)", {"account": indexed(p.address), "operator": indexed(p.address), "approved": p.bool}),
    ControllerChanged: event("0x4c97694570a07277810af7e5669ffd5f6a2d6b74b6e9a274b8b870fd5114cf87", "ControllerChanged(address,bool)", {"controller": indexed(p.address), "active": p.bool}),
    ExpiryExtended: event("0xf675815a0817338f93a7da433f6bd5f5542f1029b11b455191ac96c7f6a9b132", "ExpiryExtended(bytes32,uint64)", {"node": indexed(p.bytes32), "expiry": p.uint64}),
    FusesSet: event("0x39873f00c80f4f94b7bd1594aebcf650f003545b74824d57ddf4939e3ff3a34b", "FusesSet(bytes32,uint32)", {"node": indexed(p.bytes32), "fuses": p.uint32}),
    NameUnwrapped: event("0xee2ba1195c65bcf218a83d874335c6bf9d9067b4c672f3c3bf16cf40de7586c4", "NameUnwrapped(bytes32,address)", {"node": indexed(p.bytes32), "owner": p.address}),
    NameWrapped: event("0x8ce7013e8abebc55c3890a68f5a27c67c3f7efa64e584de5fb22363c606fd340", "NameWrapped(bytes32,bytes,address,uint32,uint64)", {"node": indexed(p.bytes32), "name": p.bytes, "owner": p.address, "fuses": p.uint32, "expiry": p.uint64}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    TransferBatch: event("0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb", "TransferBatch(address,address,address,uint256[],uint256[])", {"operator": indexed(p.address), "from": indexed(p.address), "to": indexed(p.address), "ids": p.array(p.uint256), "values": p.array(p.uint256)}),
    TransferSingle: event("0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62", "TransferSingle(address,address,address,uint256,uint256)", {"operator": indexed(p.address), "from": indexed(p.address), "to": indexed(p.address), "id": p.uint256, "value": p.uint256}),
    URI: event("0x6bb7ff708619ba0610cba295a58592e0451dee2622938c8755667688daf3529b", "URI(string,uint256)", {"value": p.string, "id": indexed(p.uint256)}),
}

export const functions = {
    _tokens: viewFun("0xed70554d", "_tokens(uint256)", {"_0": p.uint256}, p.uint256),
    allFusesBurned: viewFun("0xadf4960a", "allFusesBurned(bytes32,uint32)", {"node": p.bytes32, "fuseMask": p.uint32}, p.bool),
    balanceOf: viewFun("0x00fdd58e", "balanceOf(address,uint256)", {"account": p.address, "id": p.uint256}, p.uint256),
    balanceOfBatch: viewFun("0x4e1273f4", "balanceOfBatch(address[],uint256[])", {"accounts": p.array(p.address), "ids": p.array(p.uint256)}, p.array(p.uint256)),
    canModifyName: viewFun("0x41415eab", "canModifyName(bytes32,address)", {"node": p.bytes32, "addr": p.address}, p.bool),
    controllers: viewFun("0xda8c229e", "controllers(address)", {"_0": p.address}, p.bool),
    ens: viewFun("0x3f15457f", "ens()", {}, p.address),
    extendExpiry: fun("0x6e5d6ad2", "extendExpiry(bytes32,bytes32,uint64)", {"parentNode": p.bytes32, "labelhash": p.bytes32, "expiry": p.uint64}, p.uint64),
    getData: viewFun("0x0178fe3f", "getData(uint256)", {"id": p.uint256}, {"owner": p.address, "fuses": p.uint32, "expiry": p.uint64}),
    isApprovedForAll: viewFun("0xe985e9c5", "isApprovedForAll(address,address)", {"account": p.address, "operator": p.address}, p.bool),
    isWrapped: viewFun("0xfd0cd0d9", "isWrapped(bytes32)", {"node": p.bytes32}, p.bool),
    metadataService: viewFun("0x53095467", "metadataService()", {}, p.address),
    name: viewFun("0x06fdde03", "name()", {}, p.string),
    names: viewFun("0x20c38e2b", "names(bytes32)", {"_0": p.bytes32}, p.bytes),
    onERC721Received: fun("0x150b7a02", "onERC721Received(address,address,uint256,bytes)", {"to": p.address, "_1": p.address, "tokenId": p.uint256, "data": p.bytes}, p.bytes4),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    ownerOf: viewFun("0x6352211e", "ownerOf(uint256)", {"id": p.uint256}, p.address),
    recoverFunds: fun("0x5d3590d5", "recoverFunds(address,address,uint256)", {"_token": p.address, "_to": p.address, "_amount": p.uint256}, ),
    registerAndWrapETH2LD: fun("0xa4014982", "registerAndWrapETH2LD(string,address,uint256,address,uint16)", {"label": p.string, "wrappedOwner": p.address, "duration": p.uint256, "resolver": p.address, "ownerControlledFuses": p.uint16}, p.uint256),
    registrar: viewFun("0x2b20e397", "registrar()", {}, p.address),
    renew: fun("0xc475abff", "renew(uint256,uint256)", {"tokenId": p.uint256, "duration": p.uint256}, p.uint256),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    safeBatchTransferFrom: fun("0x2eb2c2d6", "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)", {"from": p.address, "to": p.address, "ids": p.array(p.uint256), "amounts": p.array(p.uint256), "data": p.bytes}, ),
    safeTransferFrom: fun("0xf242432a", "safeTransferFrom(address,address,uint256,uint256,bytes)", {"from": p.address, "to": p.address, "id": p.uint256, "amount": p.uint256, "data": p.bytes}, ),
    setApprovalForAll: fun("0xa22cb465", "setApprovalForAll(address,bool)", {"operator": p.address, "approved": p.bool}, ),
    setChildFuses: fun("0x33c69ea9", "setChildFuses(bytes32,bytes32,uint32,uint64)", {"parentNode": p.bytes32, "labelhash": p.bytes32, "fuses": p.uint32, "expiry": p.uint64}, ),
    setController: fun("0xe0dba60f", "setController(address,bool)", {"controller": p.address, "active": p.bool}, ),
    setFuses: fun("0x402906fc", "setFuses(bytes32,uint16)", {"node": p.bytes32, "ownerControlledFuses": p.uint16}, p.uint32),
    setMetadataService: fun("0x1534e177", "setMetadataService(address)", {"_metadataService": p.address}, ),
    setRecord: fun("0xcf408823", "setRecord(bytes32,address,address,uint64)", {"node": p.bytes32, "owner": p.address, "resolver": p.address, "ttl": p.uint64}, ),
    setResolver: fun("0x1896f70a", "setResolver(bytes32,address)", {"node": p.bytes32, "resolver": p.address}, ),
    setSubnodeOwner: fun("0xc658e086", "setSubnodeOwner(bytes32,string,address,uint32,uint64)", {"parentNode": p.bytes32, "label": p.string, "owner": p.address, "fuses": p.uint32, "expiry": p.uint64}, p.bytes32),
    setSubnodeRecord: fun("0x24c1af44", "setSubnodeRecord(bytes32,string,address,address,uint64,uint32,uint64)", {"parentNode": p.bytes32, "label": p.string, "owner": p.address, "resolver": p.address, "ttl": p.uint64, "fuses": p.uint32, "expiry": p.uint64}, p.bytes32),
    setTTL: fun("0x14ab9038", "setTTL(bytes32,uint64)", {"node": p.bytes32, "ttl": p.uint64}, ),
    setUpgradeContract: fun("0xb6bcad26", "setUpgradeContract(address)", {"_upgradeAddress": p.address}, ),
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceId": p.bytes4}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    unwrap: fun("0xd8c9921a", "unwrap(bytes32,bytes32,address)", {"parentNode": p.bytes32, "labelhash": p.bytes32, "controller": p.address}, ),
    unwrapETH2LD: fun("0x8b4dfa75", "unwrapETH2LD(bytes32,address,address)", {"labelhash": p.bytes32, "registrant": p.address, "controller": p.address}, ),
    upgrade: fun("0xee7eba78", "upgrade(bytes32,string,address,address)", {"parentNode": p.bytes32, "label": p.string, "wrappedOwner": p.address, "resolver": p.address}, ),
    upgradeContract: viewFun("0x1f4e1504", "upgradeContract()", {}, p.address),
    upgradeETH2LD: fun("0xe72bf00f", "upgradeETH2LD(string,address,address)", {"label": p.string, "wrappedOwner": p.address, "resolver": p.address}, ),
    uri: viewFun("0x0e89341c", "uri(uint256)", {"tokenId": p.uint256}, p.string),
    wrap: fun("0xeb8ae530", "wrap(bytes,address,address)", {"name": p.bytes, "wrappedOwner": p.address, "resolver": p.address}, ),
    wrapETH2LD: fun("0x8cf8b41e", "wrapETH2LD(string,address,uint16,address)", {"label": p.string, "wrappedOwner": p.address, "ownerControlledFuses": p.uint16, "resolver": p.address}, ),
}

export class Contract extends ContractBase {

    _tokens(_0: _tokensParams["_0"]) {
        return this.eth_call(functions._tokens, {_0})
    }

    allFusesBurned(node: AllFusesBurnedParams["node"], fuseMask: AllFusesBurnedParams["fuseMask"]) {
        return this.eth_call(functions.allFusesBurned, {node, fuseMask})
    }

    balanceOf(account: BalanceOfParams["account"], id: BalanceOfParams["id"]) {
        return this.eth_call(functions.balanceOf, {account, id})
    }

    balanceOfBatch(accounts: BalanceOfBatchParams["accounts"], ids: BalanceOfBatchParams["ids"]) {
        return this.eth_call(functions.balanceOfBatch, {accounts, ids})
    }

    canModifyName(node: CanModifyNameParams["node"], addr: CanModifyNameParams["addr"]) {
        return this.eth_call(functions.canModifyName, {node, addr})
    }

    controllers(_0: ControllersParams["_0"]) {
        return this.eth_call(functions.controllers, {_0})
    }

    ens() {
        return this.eth_call(functions.ens, {})
    }

    getData(id: GetDataParams["id"]) {
        return this.eth_call(functions.getData, {id})
    }

    isApprovedForAll(account: IsApprovedForAllParams["account"], operator: IsApprovedForAllParams["operator"]) {
        return this.eth_call(functions.isApprovedForAll, {account, operator})
    }

    isWrapped(node: IsWrappedParams["node"]) {
        return this.eth_call(functions.isWrapped, {node})
    }

    metadataService() {
        return this.eth_call(functions.metadataService, {})
    }

    name() {
        return this.eth_call(functions.name, {})
    }

    names(_0: NamesParams["_0"]) {
        return this.eth_call(functions.names, {_0})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    ownerOf(id: OwnerOfParams["id"]) {
        return this.eth_call(functions.ownerOf, {id})
    }

    registrar() {
        return this.eth_call(functions.registrar, {})
    }

    supportsInterface(interfaceId: SupportsInterfaceParams["interfaceId"]) {
        return this.eth_call(functions.supportsInterface, {interfaceId})
    }

    upgradeContract() {
        return this.eth_call(functions.upgradeContract, {})
    }

    uri(tokenId: UriParams["tokenId"]) {
        return this.eth_call(functions.uri, {tokenId})
    }
}

/// Event types
export type ApprovalForAllEventArgs = EParams<typeof events.ApprovalForAll>
export type ControllerChangedEventArgs = EParams<typeof events.ControllerChanged>
export type ExpiryExtendedEventArgs = EParams<typeof events.ExpiryExtended>
export type FusesSetEventArgs = EParams<typeof events.FusesSet>
export type NameUnwrappedEventArgs = EParams<typeof events.NameUnwrapped>
export type NameWrappedEventArgs = EParams<typeof events.NameWrapped>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TransferBatchEventArgs = EParams<typeof events.TransferBatch>
export type TransferSingleEventArgs = EParams<typeof events.TransferSingle>
export type URIEventArgs = EParams<typeof events.URI>

/// Function types
export type _tokensParams = FunctionArguments<typeof functions._tokens>
export type _tokensReturn = FunctionReturn<typeof functions._tokens>

export type AllFusesBurnedParams = FunctionArguments<typeof functions.allFusesBurned>
export type AllFusesBurnedReturn = FunctionReturn<typeof functions.allFusesBurned>

export type BalanceOfParams = FunctionArguments<typeof functions.balanceOf>
export type BalanceOfReturn = FunctionReturn<typeof functions.balanceOf>

export type BalanceOfBatchParams = FunctionArguments<typeof functions.balanceOfBatch>
export type BalanceOfBatchReturn = FunctionReturn<typeof functions.balanceOfBatch>

export type CanModifyNameParams = FunctionArguments<typeof functions.canModifyName>
export type CanModifyNameReturn = FunctionReturn<typeof functions.canModifyName>

export type ControllersParams = FunctionArguments<typeof functions.controllers>
export type ControllersReturn = FunctionReturn<typeof functions.controllers>

export type EnsParams = FunctionArguments<typeof functions.ens>
export type EnsReturn = FunctionReturn<typeof functions.ens>

export type ExtendExpiryParams = FunctionArguments<typeof functions.extendExpiry>
export type ExtendExpiryReturn = FunctionReturn<typeof functions.extendExpiry>

export type GetDataParams = FunctionArguments<typeof functions.getData>
export type GetDataReturn = FunctionReturn<typeof functions.getData>

export type IsApprovedForAllParams = FunctionArguments<typeof functions.isApprovedForAll>
export type IsApprovedForAllReturn = FunctionReturn<typeof functions.isApprovedForAll>

export type IsWrappedParams = FunctionArguments<typeof functions.isWrapped>
export type IsWrappedReturn = FunctionReturn<typeof functions.isWrapped>

export type MetadataServiceParams = FunctionArguments<typeof functions.metadataService>
export type MetadataServiceReturn = FunctionReturn<typeof functions.metadataService>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type NamesParams = FunctionArguments<typeof functions.names>
export type NamesReturn = FunctionReturn<typeof functions.names>

export type OnERC721ReceivedParams = FunctionArguments<typeof functions.onERC721Received>
export type OnERC721ReceivedReturn = FunctionReturn<typeof functions.onERC721Received>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type OwnerOfParams = FunctionArguments<typeof functions.ownerOf>
export type OwnerOfReturn = FunctionReturn<typeof functions.ownerOf>

export type RecoverFundsParams = FunctionArguments<typeof functions.recoverFunds>
export type RecoverFundsReturn = FunctionReturn<typeof functions.recoverFunds>

export type RegisterAndWrapETH2LDParams = FunctionArguments<typeof functions.registerAndWrapETH2LD>
export type RegisterAndWrapETH2LDReturn = FunctionReturn<typeof functions.registerAndWrapETH2LD>

export type RegistrarParams = FunctionArguments<typeof functions.registrar>
export type RegistrarReturn = FunctionReturn<typeof functions.registrar>

export type RenewParams = FunctionArguments<typeof functions.renew>
export type RenewReturn = FunctionReturn<typeof functions.renew>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SafeBatchTransferFromParams = FunctionArguments<typeof functions.safeBatchTransferFrom>
export type SafeBatchTransferFromReturn = FunctionReturn<typeof functions.safeBatchTransferFrom>

export type SafeTransferFromParams = FunctionArguments<typeof functions.safeTransferFrom>
export type SafeTransferFromReturn = FunctionReturn<typeof functions.safeTransferFrom>

export type SetApprovalForAllParams = FunctionArguments<typeof functions.setApprovalForAll>
export type SetApprovalForAllReturn = FunctionReturn<typeof functions.setApprovalForAll>

export type SetChildFusesParams = FunctionArguments<typeof functions.setChildFuses>
export type SetChildFusesReturn = FunctionReturn<typeof functions.setChildFuses>

export type SetControllerParams = FunctionArguments<typeof functions.setController>
export type SetControllerReturn = FunctionReturn<typeof functions.setController>

export type SetFusesParams = FunctionArguments<typeof functions.setFuses>
export type SetFusesReturn = FunctionReturn<typeof functions.setFuses>

export type SetMetadataServiceParams = FunctionArguments<typeof functions.setMetadataService>
export type SetMetadataServiceReturn = FunctionReturn<typeof functions.setMetadataService>

export type SetRecordParams = FunctionArguments<typeof functions.setRecord>
export type SetRecordReturn = FunctionReturn<typeof functions.setRecord>

export type SetResolverParams = FunctionArguments<typeof functions.setResolver>
export type SetResolverReturn = FunctionReturn<typeof functions.setResolver>

export type SetSubnodeOwnerParams = FunctionArguments<typeof functions.setSubnodeOwner>
export type SetSubnodeOwnerReturn = FunctionReturn<typeof functions.setSubnodeOwner>

export type SetSubnodeRecordParams = FunctionArguments<typeof functions.setSubnodeRecord>
export type SetSubnodeRecordReturn = FunctionReturn<typeof functions.setSubnodeRecord>

export type SetTTLParams = FunctionArguments<typeof functions.setTTL>
export type SetTTLReturn = FunctionReturn<typeof functions.setTTL>

export type SetUpgradeContractParams = FunctionArguments<typeof functions.setUpgradeContract>
export type SetUpgradeContractReturn = FunctionReturn<typeof functions.setUpgradeContract>

export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UnwrapParams = FunctionArguments<typeof functions.unwrap>
export type UnwrapReturn = FunctionReturn<typeof functions.unwrap>

export type UnwrapETH2LDParams = FunctionArguments<typeof functions.unwrapETH2LD>
export type UnwrapETH2LDReturn = FunctionReturn<typeof functions.unwrapETH2LD>

export type UpgradeParams = FunctionArguments<typeof functions.upgrade>
export type UpgradeReturn = FunctionReturn<typeof functions.upgrade>

export type UpgradeContractParams = FunctionArguments<typeof functions.upgradeContract>
export type UpgradeContractReturn = FunctionReturn<typeof functions.upgradeContract>

export type UpgradeETH2LDParams = FunctionArguments<typeof functions.upgradeETH2LD>
export type UpgradeETH2LDReturn = FunctionReturn<typeof functions.upgradeETH2LD>

export type UriParams = FunctionArguments<typeof functions.uri>
export type UriReturn = FunctionReturn<typeof functions.uri>

export type WrapParams = FunctionArguments<typeof functions.wrap>
export type WrapReturn = FunctionReturn<typeof functions.wrap>

export type WrapETH2LDParams = FunctionArguments<typeof functions.wrapETH2LD>
export type WrapETH2LDReturn = FunctionReturn<typeof functions.wrapETH2LD>

