import {keccak256} from 'ethers'
import {Account, Domain, Resolver} from '../../model'
import {ADDR_EMPTY, KNOWN_LABEL_HASHES} from './constants'
import {Log} from '../../processor'
import {hexToByteArray} from '../../utils'

export function instantiateMinimalDomain(
    node: string,
    timestamp: bigint,
    owner: Account,
): Domain {
    return new Domain({
        id: node,
        subdomainCount: 0,
        createdAt: timestamp,
        isMigrated: true,
        owner: owner,
    })
}

export function checkValidLabel(name: string): boolean {
    for (let i = 0; i < name.length; i++) {
        let c = name.charCodeAt(i)
        if (c === 0) {
            return false
        } else if (c === 46) {
            return false
        }
    }
    return true
}

/**
 * Decodes a given encoded domain name string.
 * @param str The encoded domain name string, starting with '0x'.
 * @returns A tuple containing the first label and the full domain name, or null if invalid.
 */
export function decodeName(str: string): [string, string] | null {
    // If the string starts with '0x', remove the prefix.
    str = str.startsWith('0x') ? str.slice(2) : str

    // Initialize the offset to start reading from the beginning of the string.
    let offset = 0
    let name = ''
    let labelName = ''
    // Extract the length of the first label from the beginning of the string.
    let lenNextLabel = parseInt(str.slice(offset * 2, (offset + 1) * 2), 16)
    offset++
    // If the length is 0, it means there's no label, so return '.'.
    if (lenNextLabel === 0) {
        return [labelName, '.']
    }
    // Continue reading labels while there are more bytes in the string.
    while (lenNextLabel) {
        // Extract the label from the string based on the provided length.
        let label = str.slice(offset * 2, (offset + lenNextLabel) * 2)
        // Convert the hexadecimal representation of the label into a readable string.
        let labelString = Buffer.from(label, 'hex').toString()
        if (!checkValidLabel(labelString)) {
            return null
        }
        if (offset > 1) {
            // If this isn't the first label, add a '.' to the domain name.
            name += '.'
        } else {
            labelName = labelString
        }
        name += labelString // Add the label to the domain name.
        offset += lenNextLabel // Move the offset to the end of the current label.
        // Get the length of the next label.
        lenNextLabel = parseInt(str.slice(offset * 2, (offset + 1) * 2), 16)
        // Increment the offset to read the next byte.
        offset++
    }

    // Return the first label and the full domain name.
    return [labelName, name]
}

/**
 * Create a subnode id from a parent node id and a hashed label
 *
 * @param node parent node id (eth: 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae)
 * @param label hashed label
 * @returns generated subnode id
 */
export function createSubnodeId(node: string, label: string): string {
    // solidity uses sha3 but its actually implemented by keccak256
    const nodeBytes = hexToByteArray(node)
    const labelBytes = hexToByteArray(label)
    
    // Create a combined buffer for hashing
    const combined = new Uint8Array(nodeBytes.length + labelBytes.length)
    combined.set(nodeBytes, 0)
    combined.set(labelBytes, nodeBytes.length)
    
    return keccak256(combined)
}

export function createResolverId(node: string, resolver: string) {
    return `${resolver}-${node}`.toLowerCase()
}

export function instantiateEmptyAddrResolver() {
    return new Resolver({
        id: ADDR_EMPTY,
        address: hexToByteArray(ADDR_EMPTY),
    })
}

export function labelNameByHash(hash: string) {
    return KNOWN_LABEL_HASHES[hash.toLowerCase()]
}

export function createEventId(log: Log) {
    return log.block.height
        .toString()
        .concat('-')
        .concat(log.logIndex.toString())
}

interface EventData {
    id: string
    blockNumber: number
    transactionID: Uint8Array
}

export function instantiateEventData<T extends EventData>(
    cls: new (props: T) => T,
    log: Log,
    idMod?: (id: string) => string,
): T {
    let id = createEventId(log)
    if (idMod) {
        id = idMod(id)
    }
    const data: EventData = {
        id,
        blockNumber: log.block.height,
        transactionID: hexToByteArray(log.transaction!.hash),
    }

    return new cls(data as T)
}
