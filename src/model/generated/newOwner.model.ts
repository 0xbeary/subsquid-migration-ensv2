import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"
import {Account} from "./account.model"

@Entity_()
export class NewOwner {
    constructor(props?: Partial<NewOwner>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The parent domain of the domain name associated with the event
     */
    @Index_()
    @ManyToOne_(() => Domain, {nullable: true})
    parentDomain!: Domain

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
     * The new account that owns the domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account
}
