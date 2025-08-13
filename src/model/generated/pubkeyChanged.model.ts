import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class PubkeyChanged {
    constructor(props?: Partial<PubkeyChanged>) {
        Object.assign(this, props)
    }

    /**
     * Concatenation of block number and log ID
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Used to derive relationships to Resolvers
     */
    @Index_()
    @ManyToOne_(() => Resolver, {nullable: true})
    resolver!: Resolver

    /**
     * Block number of the Ethereum block where the event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * Transaction hash of the Ethereum transaction where the event occurred
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The x-coordinate of the new public key
     */
    @BytesColumn_({nullable: false})
    x!: Uint8Array

    /**
     * The y-coordinate of the new public key
     */
    @BytesColumn_({nullable: false})
    y!: Uint8Array
}
