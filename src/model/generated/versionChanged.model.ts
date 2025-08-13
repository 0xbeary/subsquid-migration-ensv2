import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class VersionChanged {
    constructor(props?: Partial<VersionChanged>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier for this event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The resolver associated with this event
     */
    @Index_()
    @ManyToOne_(() => Resolver, {nullable: true})
    resolver!: Resolver

    /**
     * The block number at which the event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction hash associated with the event
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The new version number of the resolver
     */
    @BigIntColumn_({nullable: false})
    version!: bigint
}
