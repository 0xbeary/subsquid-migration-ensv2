import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"

@Entity_()
export class ExpiryExtended {
    constructor(props?: Partial<ExpiryExtended>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The domain name associated with the event
     */
    @Index_()
    @ManyToOne_(() => Domain, {nullable: true})
    domain!: Domain

    /**
     * The block number at which the event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction hash of the transaction that triggered the event
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The new expiry date associated with the domain after the extension event
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint
}
