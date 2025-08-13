import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BytesColumn as BytesColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"
import {Resolver} from "./resolver.model"

@Entity_()
export class AuthorisationChanged {
    constructor(props?: Partial<AuthorisationChanged>) {
        Object.assign(this, props)
    }

    /**
     * Unique identifier for this event
     */
    @PrimaryColumn_()
    id!: string

    /**
     * The resolver associated with this event
     */
    @Index_()
    @ManyToOne_(() => Resolver, {nullable: true})
    resolver!: Resolver

    /**
     * The block number at which the event occurred
     */
    @IntColumn_({nullable: false})
    blockNumber!: number

    /**
     * The transaction hash associated with the event
     */
    @BytesColumn_({nullable: false})
    transactionID!: Uint8Array

    /**
     * The owner of the authorisation
     */
    @BytesColumn_({nullable: false})
    owner!: Uint8Array

    /**
     * The target of the authorisation
     */
    @BytesColumn_({nullable: false})
    target!: Uint8Array

    /**
     * Whether the authorisation was added or removed
     */
    @BooleanColumn_({nullable: false})
    isAuthorized!: boolean
}
