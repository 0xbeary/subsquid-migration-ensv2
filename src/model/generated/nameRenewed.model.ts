import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Registration} from "./registration.model"

@Entity_()
export class NameRenewed {
    constructor(props?: Partial<NameRenewed>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the NameRenewed event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The registration associated with the event
     */
    @Index_()
    @ManyToOne_(() => Registration, {nullable: true})
    registration!: Registration

    /**
     * The block number of the event
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction ID associated with the event
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The new expiry date of the registration
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint
}
