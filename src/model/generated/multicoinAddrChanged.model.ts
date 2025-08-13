import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class MulticoinAddrChanged {
    constructor(props?: Partial<MulticoinAddrChanged>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier for the event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * Resolver associated with this event
     */
    @Index_()
    @ManyToOne_(() => Resolver, {nullable: true})
    resolver!: Resolver

    /**
     * Block number in which this event was emitted
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * Transaction ID in which this event was emitted
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The coin type of the changed address
     */
    @BigIntColumn_({nullable: false})
    coinType!: bigint

    /**
     * The new address value for the given coin type
     */
    @BytesColumn_({nullable: false})
    addr!: Uint8Array
}
