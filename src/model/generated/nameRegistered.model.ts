import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Registration} from "./registration.model"
import {Account} from "./account.model"

@Entity_()
export class NameRegistered {
    constructor(props?: Partial<NameRegistered>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the NameRegistered event
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
     * The account that registered the name
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    registrant!: Account

    /**
     * The expiry date of the registration
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint
}
