export function bigintToHex(value: bigint): string {
    return '0x' + value.toString(16).toLowerCase()
}

export function uint256ToHex(id: bigint) {
    return '0x' + bigintToHex(id).toLowerCase().slice(2).padStart(64, '0')
}

export function hexToByteArray(hexString: string): Uint8Array {
    if (hexString.startsWith('0x')) {
        hexString = hexString.slice(2) // remove prefix
    }
    // Convert Buffer to Uint8Array to avoid type compatibility issues
    return new Uint8Array(Buffer.from(hexString, 'hex'))
}
