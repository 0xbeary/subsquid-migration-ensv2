import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BytesColumn as BytesColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, BooleanColumn as BooleanColumn_, OneToOne as OneToOne_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"
import {Resolver} from "./resolver.model"
import {Registration} from "./registration.model"
import {WrappedDomain} from "./wrappedDomain.model"

@Entity_()
export class Domain {
    constructor(props?: Partial<Domain>) {
        Object.assign(this, props)
    }

    /**
     * The namehash of the name
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The human readable name, if known. Unknown portions replaced with hash in square brackets (eg, foo.[1234].eth)
     */
    @StringColumn_({nullable: true})
    name!: string | undefined | null

    /**
     * The human readable label name (imported from CSV), if known
     */
    @StringColumn_({nullable: true})
    labelName!: string | undefined | null

    /**
     * keccak256(labelName)
     */
    @BytesColumn_({nullable: true})
    labelhash!: Uint8Array | undefined | null

    /**
     * The namehash (id) of the parent name
     */
    @Index_()
    @ManyToOne_(() => Domain, {nullable: true})
    parent!: Domain | undefined | null

    /**
     * Can count domains from length of array
     */
    @OneToMany_(() => Domain, e => e.parent)
    subdomains!: Domain[]

    /**
     * The number of subdomains
     */
    @IntColumn_({nullable: false})
    subdomainCount!: number

    /**
     * Address logged from current resolver, if any
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    resolvedAddress!: Account | undefined | null

    /**
     * The resolver that controls the domain's settings
     */
    @Index_()
    @ManyToOne_(() => Resolver, {nullable: true})
    resolver!: Resolver | undefined | null

    /**
     * The time-to-live (TTL) value of the domain's records
     */
    @BigIntColumn_({nullable: true})
    ttl!: bigint | undefined | null

    /**
     * Indicates whether the domain has been migrated to a new registrar
     */
    @BooleanColumn_({nullable: false})
    isMigrated!: boolean

    /**
     * The time when the domain was created
     */
    @BigIntColumn_({nullable: false})
    createdAt!: bigint

    /**
     * The account that owns the domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    owner!: Account

    /**
     * The account that owns the ERC721 NFT for the domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    registrant!: Account | undefined | null

    /**
     * The account that owns the wrapped domain
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    wrappedOwner!: Account | undefined | null

    /**
     * The expiry date for the domain, from either the registration, or the wrapped domain if PCC is burned
     */
    @BigIntColumn_({nullable: true})
    expiryDate!: bigint | undefined | null

    /**
     * The registration associated with the domain
     */
    @OneToOne_(() => Registration, e => e.domain)
    registration!: Registration | undefined | null

    /**
     * The wrapped domain associated with the domain
     */
    @OneToOne_(() => WrappedDomain, e => e.domain)
    wrappedDomain!: WrappedDomain | undefined | null
}
