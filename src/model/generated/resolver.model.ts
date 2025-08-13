import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, BytesColumn as BytesColumn_, StringColumn as StringColumn_} from "@subsquid/typeorm-store"
import {Domain} from "./domain.model"
import {Account} from "./account.model"

@Entity_()
export class Resolver {
    constructor(props?: Partial<Resolver>) {
        Object.assign(this, props)
    }

    /**
     * The unique identifier for this resolver, which is a concatenation of the resolver address and the domain namehash
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The domain that this resolver is associated with
     */
    @Index_()
    @ManyToOne_(() => Domain, {nullable: true})
    domain!: Domain | undefined | null

    /**
     * The address of the resolver contract
     */
    @BytesColumn_({nullable: false})
    address!: Uint8Array

    /**
     * The current value of the 'addr' record for this resolver, as determined by the associated events
     */
    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    addr!: Account | undefined | null

    /**
     * The content hash for this resolver, in binary format
     */
    @BytesColumn_({nullable: true})
    contentHash!: Uint8Array | undefined | null

    /**
     * The set of observed text record keys for this resolver
     */
    @StringColumn_({array: true, nullable: true})
    texts!: (string)[] | undefined | null

    /**
     * The set of observed SLIP-44 coin types for this resolver
     */
    @StringColumn_({array: true, nullable: true})
    coinTypes!: (string)[] | undefined | null
}
