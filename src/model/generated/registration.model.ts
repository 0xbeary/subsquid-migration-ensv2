import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, BigIntColumn as BigIntColumn_, ManyToOne as ManyToOne_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"
import {Account} from "./account.model"

@Entity_()
export class Registration {
    constructor(props?: Partial<Registration>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier of the registration
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The domain name associated with the registration
     */
    @Index_({unique: true})
    @OneToOne_(() => Domain, {nullable: true})
    @JoinColumn_()
    domain!: Domain

    /**
     * The registration date of the domain
     */
    @BigIntColumn_({nullable: false})
    registrationDate!: bigint

    /**
     * The expiry date of the domain
     */
    @BigIntColumn_({nullable: false})
    expiryDate!: bigint

    /**
     * The cost associated with the domain registration
     */
    @BigIntColumn_({nullable: true})
    cost!: bigint | undefined | null

    /**
     * The account that registered the domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    registrant!: Account

    /**
     * The human-readable label name associated with the domain registration
     */
    @StringColumn_({nullable: true})
    labelName!: string | undefined | null
}
