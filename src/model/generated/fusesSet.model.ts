import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"

@Entity_()
export class FusesSet {
    constructor(props?: Partial<FusesSet>) {
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
     * The number of fuses associated with the domain after the set event
     */
    @IntColumn_({nullable: false})
    fuses!: number
}
