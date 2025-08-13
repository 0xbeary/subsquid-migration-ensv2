import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class NameChanged {
    constructor(props?: Partial<NameChanged>) {
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
     * Block number where event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * Unique transaction ID where event occurred
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * New ENS name value
     */
    @StringColumn_({nullable: false})
    name!: string
}
