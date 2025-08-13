import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    AuthorisationChanged: event("0xe1c5610a6e0cbe10764ecd182adcef1ec338dc4e199c99c32ce98f38e12791df", "AuthorisationChanged(bytes32,address,address,bool)", {"node": indexed(p.bytes32), "owner": indexed(p.address), "target": indexed(p.address), "isAuthorised": p.bool}),
    'TextChanged(bytes32 indexed,string indexed,string)': event("0xd8c9334b1a9c2f9da342a0a2b32629c1a229b6445dad78947f674b44444a7550", "TextChanged(bytes32,string,string)", {"node": indexed(p.bytes32), "indexedKey": indexed(p.string), "key": p.string}),
    'TextChanged(bytes32 indexed,string indexed,string,string)': event("0x448bc014f1536726cf8d54ff3d6481ed3cbc683c2591ca204274009afa09b1a1", "TextChanged(bytes32,string,string,string)", {"node": indexed(p.bytes32), "indexedKey": indexed(p.string), "key": p.string, "value": p.string}),
    PubkeyChanged: event("0x1d6f5e03d3f63eb58751986629a5439baee5079ff04f345becb66e23eb154e46", "PubkeyChanged(bytes32,bytes32,bytes32)", {"node": indexed(p.bytes32), "x": p.bytes32, "y": p.bytes32}),
    NameChanged: event("0xb7d29e911041e8d9b843369e890bcb72c9388692ba48b65ac54e7214c4c348f7", "NameChanged(bytes32,string)", {"node": indexed(p.bytes32), "name": p.string}),
    InterfaceChanged: event("0x7c69f06bea0bdef565b709e93a147836b0063ba2dd89f02d0b7e8d931e6a6daa", "InterfaceChanged(bytes32,bytes4,address)", {"node": indexed(p.bytes32), "interfaceID": indexed(p.bytes4), "implementer": p.address}),
    ContenthashChanged: event("0xe379c1624ed7e714cc0937528a32359d69d5281337765313dba4e081b72d7578", "ContenthashChanged(bytes32,bytes)", {"node": indexed(p.bytes32), "hash": p.bytes}),
    AddrChanged: event("0x52d7d861f09ab3d26239d492e8968629f95e9e318cf0b73bfddc441522a15fd2", "AddrChanged(bytes32,address)", {"node": indexed(p.bytes32), "a": p.address}),
    AddressChanged: event("0x65412581168e88a1e60c6459d7f44ae83ad0832e670826c05a4e2476b57af752", "AddressChanged(bytes32,uint256,bytes)", {"node": indexed(p.bytes32), "coinType": p.uint256, "newAddress": p.bytes}),
    ABIChanged: event("0xaa121bbeef5f32f5961a2a28966e769023910fc9479059ee3495d4c1a696efe3", "ABIChanged(bytes32,uint256)", {"node": indexed(p.bytes32), "contentType": indexed(p.uint256)}),
    VersionChanged: event("0xc6621ccb8f3f5a04bb6502154b2caf6adf5983fe76dfef1cfc9c42e3579db444", "VersionChanged(bytes32,uint64)", {"node": indexed(p.bytes32), "newVersion": p.uint64}),
}

export const functions = {
    supportsInterface: viewFun("0x01ffc9a7", "supportsInterface(bytes4)", {"interfaceID": p.bytes4}, p.bool),
    setText: fun("0x10f13a8c", "setText(bytes32,string,string)", {"node": p.bytes32, "key": p.string, "value": p.string}, ),
    interfaceImplementer: viewFun("0x124a319c", "interfaceImplementer(bytes32,bytes4)", {"node": p.bytes32, "interfaceID": p.bytes4}, p.address),
    ABI: viewFun("0x2203ab56", "ABI(bytes32,uint256)", {"node": p.bytes32, "contentTypes": p.uint256}, {"_0": p.uint256, "_1": p.bytes}),
    setPubkey: fun("0x29cd62ea", "setPubkey(bytes32,bytes32,bytes32)", {"node": p.bytes32, "x": p.bytes32, "y": p.bytes32}, ),
    setContenthash: fun("0x304e6ade", "setContenthash(bytes32,bytes)", {"node": p.bytes32, "hash": p.bytes}, ),
    'addr(bytes32)': viewFun("0x3b3b57de", "addr(bytes32)", {"node": p.bytes32}, p.address),
    setAuthorisation: fun("0x3e9ce794", "setAuthorisation(bytes32,address,bool)", {"node": p.bytes32, "target": p.address, "isAuthorised": p.bool}, ),
    text: viewFun("0x59d1d43c", "text(bytes32,string)", {"node": p.bytes32, "key": p.string}, p.string),
    setABI: fun("0x623195b0", "setABI(bytes32,uint256,bytes)", {"node": p.bytes32, "contentType": p.uint256, "data": p.bytes}, ),
    name: viewFun("0x691f3431", "name(bytes32)", {"node": p.bytes32}, p.string),
    setName: fun("0x77372213", "setName(bytes32,string)", {"node": p.bytes32, "name": p.string}, ),
    'setAddr(bytes32,uint256,bytes)': fun("0x8b95dd71", "setAddr(bytes32,uint256,bytes)", {"node": p.bytes32, "coinType": p.uint256, "a": p.bytes}, ),
    contenthash: viewFun("0xbc1c58d1", "contenthash(bytes32)", {"node": p.bytes32}, p.bytes),
    pubkey: viewFun("0xc8690233", "pubkey(bytes32)", {"node": p.bytes32}, {"x": p.bytes32, "y": p.bytes32}),
    'setAddr(bytes32,address)': fun("0xd5fa2b00", "setAddr(bytes32,address)", {"node": p.bytes32, "a": p.address}, ),
    setInterface: fun("0xe59d895d", "setInterface(bytes32,bytes4,address)", {"node": p.bytes32, "interfaceID": p.bytes4, "implementer": p.address}, ),
    'addr(bytes32,uint256)': viewFun("0xf1cb7e06", "addr(bytes32,uint256)", {"node": p.bytes32, "coinType": p.uint256}, p.bytes),
    authorisations: viewFun("0xf86bc879", "authorisations(bytes32,address,address)", {"_0": p.bytes32, "_1": p.address, "_2": p.address}, p.bool),
}

export class Contract extends ContractBase {

    supportsInterface(interfaceID: SupportsInterfaceParams["interfaceID"]) {
        return this.eth_call(functions.supportsInterface, {interfaceID})
    }

    interfaceImplementer(node: InterfaceImplementerParams["node"], interfaceID: InterfaceImplementerParams["interfaceID"]) {
        return this.eth_call(functions.interfaceImplementer, {node, interfaceID})
    }

    ABI(node: ABIParams["node"], contentTypes: ABIParams["contentTypes"]) {
        return this.eth_call(functions.ABI, {node, contentTypes})
    }

    'addr(bytes32)'(node: AddrParams_0["node"]) {
        return this.eth_call(functions['addr(bytes32)'], {node})
    }

    text(node: TextParams["node"], key: TextParams["key"]) {
        return this.eth_call(functions.text, {node, key})
    }

    name(node: NameParams["node"]) {
        return this.eth_call(functions.name, {node})
    }

    contenthash(node: ContenthashParams["node"]) {
        return this.eth_call(functions.contenthash, {node})
    }

    pubkey(node: PubkeyParams["node"]) {
        return this.eth_call(functions.pubkey, {node})
    }

    'addr(bytes32,uint256)'(node: AddrParams_1["node"], coinType: AddrParams_1["coinType"]) {
        return this.eth_call(functions['addr(bytes32,uint256)'], {node, coinType})
    }

    authorisations(_0: AuthorisationsParams["_0"], _1: AuthorisationsParams["_1"], _2: AuthorisationsParams["_2"]) {
        return this.eth_call(functions.authorisations, {_0, _1, _2})
    }
}

/// Event types
export type AuthorisationChangedEventArgs = EParams<typeof events.AuthorisationChanged>
export type TextChangedEventArgs_0 = EParams<typeof events['TextChanged(bytes32 indexed,string indexed,string)']>
export type TextChangedEventArgs_1 = EParams<typeof events['TextChanged(bytes32 indexed,string indexed,string,string)']>
export type PubkeyChangedEventArgs = EParams<typeof events.PubkeyChanged>
export type NameChangedEventArgs = EParams<typeof events.NameChanged>
export type InterfaceChangedEventArgs = EParams<typeof events.InterfaceChanged>
export type ContenthashChangedEventArgs = EParams<typeof events.ContenthashChanged>
export type AddrChangedEventArgs = EParams<typeof events.AddrChanged>
export type AddressChangedEventArgs = EParams<typeof events.AddressChanged>
export type ABIChangedEventArgs = EParams<typeof events.ABIChanged>
export type VersionChangedEventArgs = EParams<typeof events.VersionChanged>

/// Function types
export type SupportsInterfaceParams = FunctionArguments<typeof functions.supportsInterface>
export type SupportsInterfaceReturn = FunctionReturn<typeof functions.supportsInterface>

export type SetTextParams = FunctionArguments<typeof functions.setText>
export type SetTextReturn = FunctionReturn<typeof functions.setText>

export type InterfaceImplementerParams = FunctionArguments<typeof functions.interfaceImplementer>
export type InterfaceImplementerReturn = FunctionReturn<typeof functions.interfaceImplementer>

export type ABIParams = FunctionArguments<typeof functions.ABI>
export type ABIReturn = FunctionReturn<typeof functions.ABI>

export type SetPubkeyParams = FunctionArguments<typeof functions.setPubkey>
export type SetPubkeyReturn = FunctionReturn<typeof functions.setPubkey>

export type SetContenthashParams = FunctionArguments<typeof functions.setContenthash>
export type SetContenthashReturn = FunctionReturn<typeof functions.setContenthash>

export type AddrParams_0 = FunctionArguments<typeof functions['addr(bytes32)']>
export type AddrReturn_0 = FunctionReturn<typeof functions['addr(bytes32)']>

export type SetAuthorisationParams = FunctionArguments<typeof functions.setAuthorisation>
export type SetAuthorisationReturn = FunctionReturn<typeof functions.setAuthorisation>

export type TextParams = FunctionArguments<typeof functions.text>
export type TextReturn = FunctionReturn<typeof functions.text>

export type SetABIParams = FunctionArguments<typeof functions.setABI>
export type SetABIReturn = FunctionReturn<typeof functions.setABI>

export type NameParams = FunctionArguments<typeof functions.name>
export type NameReturn = FunctionReturn<typeof functions.name>

export type SetNameParams = FunctionArguments<typeof functions.setName>
export type SetNameReturn = FunctionReturn<typeof functions.setName>

export type SetAddrParams_0 = FunctionArguments<typeof functions['setAddr(bytes32,uint256,bytes)']>
export type SetAddrReturn_0 = FunctionReturn<typeof functions['setAddr(bytes32,uint256,bytes)']>

export type ContenthashParams = FunctionArguments<typeof functions.contenthash>
export type ContenthashReturn = FunctionReturn<typeof functions.contenthash>

export type PubkeyParams = FunctionArguments<typeof functions.pubkey>
export type PubkeyReturn = FunctionReturn<typeof functions.pubkey>

export type SetAddrParams_1 = FunctionArguments<typeof functions['setAddr(bytes32,address)']>
export type SetAddrReturn_1 = FunctionReturn<typeof functions['setAddr(bytes32,address)']>

export type SetInterfaceParams = FunctionArguments<typeof functions.setInterface>
export type SetInterfaceReturn = FunctionReturn<typeof functions.setInterface>

export type AddrParams_1 = FunctionArguments<typeof functions['addr(bytes32,uint256)']>
export type AddrReturn_1 = FunctionReturn<typeof functions['addr(bytes32,uint256)']>

export type AuthorisationsParams = FunctionArguments<typeof functions.authorisations>
export type AuthorisationsReturn = FunctionReturn<typeof functions.authorisations>

