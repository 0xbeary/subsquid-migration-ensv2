import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"
import {Account} from "./account.model"

@Entity_()
export class AddrChanged {
    constructor(props?: Partial<AddrChanged>) {
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
     * The block number at which this event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction ID for the transaction in which this event occurred
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The new address associated with the resolver
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    addr!: Account
}
