import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class ContenthashChanged {
    constructor(props?: Partial<ContenthashChanged>) {
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
     * The block number where the event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The ID of the transaction where the event occurred
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The new content hash for the domain
     */
    @BytesColumn_({nullable: false})
    hash!: Uint8Array
}
