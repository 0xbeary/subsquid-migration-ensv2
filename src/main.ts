import {TypeormDatabase} from '@subsquid/typeorm-store'
import {mapper, processor} from './processor'
import {EntitySyncManager, SimpleQueue} from './context'
import {Account, Domain, Registration, Resolver, WrappedDomain} from './model'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    ctx.log.debug('Making queue...')
    const esm = new EntitySyncManager()
    const queue = new SimpleQueue()
    const c = {...ctx, queue: queue, esm: esm}
    for (let b of ctx.blocks) {
        for (let log of b.logs) {
            try {
                await mapper.processLog(c, log)
            } catch (err) {
                ctx.log.warn(
                    `Error while preprocessing log. block-height: ${log.block.height} tx: ${log.transaction?.hash} log-address: ${log.address} topic: ${log.topics[0]} ${err}`,
                )
            }
        }
    }
    ctx.log.debug('Executing queue...')
    await queue.executeAll({
        onStart: async () => await esm.load(ctx),
        onEnd: async () =>
            await esm.flush(ctx, [
                Account,
                Domain,
                Resolver,
                WrappedDomain,
                Registration,
            ]),
    })
    ctx.log.debug('Done.')
})
