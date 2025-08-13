import {EntityClass, Store} from '@subsquid/typeorm-store'
import {FindOptionsRelations, In} from 'typeorm'
import {ProcessorContext} from '../processor'

// Define a type that represents any entity with an id property
type AnyEntity = { id: string }

// Helper type to extract the entity type from EntityClass
type EntityInstance<T> = T extends EntityClass<infer E> ? E : never

/**
 * A utility class for managing nested maps with EntityClass as the primary key.
 * The nested map uses generic types A and B as key and value respectively.
 */
class EntityClassMap<A, B> {
    private map: Map<EntityClass<AnyEntity>, Map<A, B>> = new Map()

    /**
     * Ensures that a sub-map exists for the given entity class.
     * If not, initializes it.
     * @param entityClass - The EntityClass key to check or initialize.
     * @returns - The sub-map associated with the entity class.
     */
    private ensureSubMap<E extends AnyEntity>(
        entityClass: EntityClass<E>,
    ): Map<A, B> {
        if (!this.map.has(entityClass as EntityClass<AnyEntity>)) {
            this.map.set(entityClass as EntityClass<AnyEntity>, new Map())
        }
        return this.map.get(entityClass as EntityClass<AnyEntity>) as Map<A, B>
    }

    /**
     * Provides an iterator over the main map entries.
     */
    *entries(): IterableIterator<[EntityClass<AnyEntity>, Map<A, B>]> {
        for (let [entityClass, subMap] of this.map) {
            yield [entityClass, subMap]
        }
    }

    *keys(): IterableIterator<EntityClass<AnyEntity>> {
        for (let [entityClass] of this.map) {
            yield entityClass
        }
    }

    /**
     * Returns the sub-map associated with the given entity class.
     * @param entityClass - The EntityClass key to retrieve.
     */
    subMap<E extends AnyEntity>(entityClass: EntityClass<E>): Map<A, B> {
        return this.ensureSubMap(entityClass)
    }

    /**
     * Set a value in the sub-map of the given entity class.
     * @param entityClass - The EntityClass key.
     * @param key - The key in the sub-map.
     * @param value - The value to set.
     */
    set<E extends AnyEntity>(entityClass: EntityClass<E>, key: A, value: B): void {
        this.ensureSubMap(entityClass).set(key, value)
    }

    /**
     * Get a value from the sub-map of the given entity class.
     * @param entityClass - The EntityClass key.
     * @param key - The key in the sub-map.
     * @returns - The retrieved value or undefined.
     */
    get<E extends AnyEntity>(entityClass: EntityClass<E>, key: A): B | undefined {
        return this.ensureSubMap(entityClass).get(key)
    }

    /**
     * Check if a key exists in the sub-map of the given entity class.
     * @param entityClass - The EntityClass key.
     * @param key - The key to check.
     * @returns - True if the key exists, otherwise false.
     */
    has<E extends AnyEntity>(entityClass: EntityClass<E>, key: A): boolean {
        return this.ensureSubMap(entityClass).has(key)
    }

    /**
     * Delete a key-value pair from the sub-map of the given entity class.
     * @param entityClass - The EntityClass key.
     * @param key - The key to delete.
     */
    delete<E extends AnyEntity>(entityClass: EntityClass<E>, key: A): void {
        this.ensureSubMap(entityClass).delete(key)
    }
}

function* chunkArray<T>(array: T[], size: number): Generator<T[]> {
    for (let i = 0; i < array.length; i += size) {
        yield array.slice(i, i + size)
    }
}
export type Deferred<E extends AnyEntity> = {
    get: () => E | undefined
}

/**
 * EntitySyncManager is responsible for managing the synchronization of entities
 * between the application's memory (cache) and an external store.
 *
 * The manager provides functionalities to:
 * - Reserve entities for future retrieval from the store.
 * - Load reserved entities into the cache.
 * - Save (or cache) entities and mark them for future saving to the store.
 * - Flush the save entities to the store.
 */
export class EntitySyncManager {
    private relationsForLoading = new Map<
        EntityClass<AnyEntity>,
        FindOptionsRelations<AnyEntity>
    >()
    private entityIdsToLoad: EntityClassMap<string, {}> = new EntityClassMap()
    private entityIdsToSave: EntityClassMap<string, {}> = new EntityClassMap()
    private entitiesToSaveEarlier: EntityClassMap<string, AnyEntity> =
        new EntityClassMap()
    private entitiesToRemove: EntityClassMap<string, AnyEntity> =
        new EntityClassMap()

    private cachedEntities: EntityClassMap<string, AnyEntity> =
        new EntityClassMap()

    /**
     * Reserve an entity for future retrieval.
     * @param entityClass - The class of the entity to reserve.
     * @param id - The ID of the entity to reserve.
     * @param relations - The relations to load with the entity.
     * @returns - An object with a method to get the reserved entity.
     */
    prepare<E extends AnyEntity>(
        entityClass: EntityClass<E>,
        id: string,
        relations: FindOptionsRelations<E> = {},
    ): Deferred<E> {
        this.relationsForLoading.set(entityClass as EntityClass<AnyEntity>, {
            ...(this.relationsForLoading.get(entityClass as EntityClass<AnyEntity>) || {}),
            ...relations,
        } as FindOptionsRelations<AnyEntity>)
        this.entityIdsToLoad.set(entityClass, id, {})
        return {
            get: () =>
                this.cachedEntities.get(entityClass, id) as E | undefined,
        }
    }

    /**
     * Load reserved entities from the provided store into the cache.
     *
     * @param ctx - The processor context.
     */
    async load(ctx: ProcessorContext<Store>) {
        ctx.log.debug('Loading entities from DB...')
        for (let [entityClass, map] of this.entityIdsToLoad.entries()) {
            // Find entities that are not in this.cachedEntities
            const idsToLoad = [...map.keys()].filter((id) => {
                const cached = this.cachedEntities.subMap(entityClass).get(id)
                if (!cached) {
                    return true
                }
                const relations = this.relationsForLoading.get(entityClass as EntityClass<AnyEntity>)
                if (!relations) {
                    return false
                }
                const missingRelations = Object.keys(relations).filter(
                    (relation) => !(cached as any)[relation],
                )
                return missingRelations.length > 0
            })
            if (idsToLoad.length === 0) continue
            // calc chunk size according to id length
            const idLength = idsToLoad[0].length
            const maxLengthForIn = 50_000
            const chunkSize = Math.max(
                3_000,
                Math.floor(maxLengthForIn / idLength),
            )
            for (const idChunk of chunkArray(idsToLoad, chunkSize)) {
                const chunkedEntities = await ctx.store.find(entityClass, {
                    where: {
                        id: In(idChunk),
                    },
                    relations: this.relationsForLoading.get(entityClass as EntityClass<AnyEntity>),
                })
                // Directly set entities to the cache
                chunkedEntities.forEach((entity) =>
                    this.cachedEntities.set(entityClass, entity.id, entity as AnyEntity),
                )
                ctx.log.debug(
                    `Loaded ${entityClass.name} ${chunkedEntities.length} entities.`,
                )
            }
        }
        this.entityIdsToLoad = new EntityClassMap()
        ctx.log.debug('Loaded.')
    }

    /**
     * Cache the provided entity and mark it for saving earlier than the other entities.
     * Just to save ID for avoiding fk constraints error
     * @param entity - The entity to cache and mark for saving.
     */
    saveForId<E extends AnyEntity>(entity: E) {
        const entityClass = entity.constructor as EntityClass<E>
        this.entitiesToSaveEarlier.set(entityClass, entity.id, entity)
        this.entitiesToRemove.delete(entityClass, entity.id)
    }

    /**
     * Cache the provided entity and mark it for future saving.
     * @param entity - The entity to cache and mark for saving.
     */
    save<E extends AnyEntity>(entity: E) {
        const entityClass = entity.constructor as EntityClass<E>
        this.cachedEntities.set(entityClass, entity.id, entity)
        this.entityIdsToSave.set(entityClass, entity.id, {})
        this.entitiesToRemove.delete(entityClass, entity.id)
    }

    /**
     * Remove the provided entity from the cache and mark it for future deletion
     * @param entity - The entity to cache and mark for saving.
     */
    remove<E extends AnyEntity>(entity: E) {
        const entityClass = entity.constructor as EntityClass<E>
        this.cachedEntities.delete(entityClass, entity.id)
        this.entitiesToRemove.set(entityClass, entity.id, entity)
    }

    /**
     * Upsert cached entities to the provided store.
     * @param ctx - The processor context.
     */
    async flush(
        ctx: ProcessorContext<Store>,
        priorityOrder: EntityClass<AnyEntity>[] = [],
    ) {
        ctx.log.debug('Flushing entities to DB...')
        const order = [
            ...priorityOrder,
            ...[...this.entityIdsToSave.keys()].filter(
                (entityClass) => !priorityOrder.includes(entityClass),
            ),
        ]
        // save earlier entities
        for (let entityClass of [
            ...order,
            ...[...this.entitiesToSaveEarlier.keys()].filter(
                (ec) => !order.includes(ec),
            ),
        ]) {
            const map = this.entitiesToSaveEarlier.subMap(entityClass)
            const entitiesToSave = [...map.values()]
            if (entitiesToSave.length === 0) continue
            ctx.log.debug(`Flushing (earlier) ${entityClass.name}: ${map.size}`)
            await ctx.store.upsert(entitiesToSave)
        }
        this.entitiesToSaveEarlier = new EntityClassMap()
        // save normal entities
        for (let entityClass of order) {
            const map = this.entityIdsToSave.subMap(entityClass)
            const entitiesToSave = [...map.keys()]
                .map((id) => this.cachedEntities.get(entityClass, id))
                .filter((entity) => entity !== undefined) as AnyEntity[]
            if (entitiesToSave.length === 0) continue
            ctx.log.debug(`Flushing ${entityClass.name}: ${map.size}`)
            await ctx.store.upsert(entitiesToSave)
        }
        this.entityIdsToSave = new EntityClassMap()

        // delete entities
        const deletingClasses = [
            ...[...this.entitiesToRemove.keys()].filter(
                (ec) => !priorityOrder.includes(ec),
            ),
            ...priorityOrder.reverse(),
        ]
        for (const entityClass of deletingClasses) {
            const map = this.entitiesToRemove.subMap(entityClass)
            const entities = [...map.values()]
            if (entities.length === 0) continue
            ctx.log.debug(`Removing ${entityClass.name}: ${map.size}`)
            await ctx.store.remove(entities)
        }
        ctx.log.debug('Flushed.')
    }
}
