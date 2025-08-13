import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"
import {Account} from "./account.model"

@Entity_()
export class NameWrapped {
    constructor(props?: Partial<NameWrapped>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the wrapped domain
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The domain name associated with the wrapped domain
     */
    @Index_()
    @ManyToOne_(() => Domain, {nullable: true})
    domain!: Domain

    /**
     * The block number at which the wrapped domain was wrapped
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction hash of the transaction that wrapped the domain
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The human-readable name of the wrapped domain
     */
    @StringColumn_({nullable: true})
    name!: string | undefined | null

    /**
     * The number of fuses associated with the wrapped domain
     */
    @IntColumn_({nullable: false})
    fuses!: number

    /**
     * The account that owns the wrapped domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    /**
     * The expiry date of the wrapped domain registration
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint
}
