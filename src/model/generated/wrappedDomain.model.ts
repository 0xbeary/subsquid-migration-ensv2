import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, ManyToOne as ManyToOne_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"
import {Account} from "./account.model"

@Entity_()
export class WrappedDomain {
    constructor(props?: Partial<WrappedDomain>) {
        Object.assign(this, props)
    }

    /**
     * unique identifier for each instance of the WrappedDomain entity
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The domain that is wrapped by this WrappedDomain
     */
    @Index_({unique: true})
    @OneToOne_(() => Domain, {nullable: true})
    @JoinColumn_()
    domain!: Domain

    /**
     * The expiry date of the wrapped domain
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint

    /**
     * The number of fuses remaining on the wrapped domain
     */
    @IntColumn_({nullable: false})
    fuses!: number

    /**
     * The account that owns this WrappedDomain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    /**
     * The name of the wrapped domain
     */
    @StringColumn_({nullable: true})
    name!: string | undefined | null
}
