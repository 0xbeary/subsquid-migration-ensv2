import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import {Store} from '@subsquid/typeorm-store'
import {SimpleQueue, EntitySyncManager} from './context'
import * as mapping from './mapping'
import {patchStore} from './patch'
import {assertNotNull} from '@subsquid/util-internal'


patchStore()
export const processor = new EvmBatchProcessor()
    .setPortal(assertNotNull(
       process.env.PORTAL_URL,
       'Required env variable PORTAL_URL is missing'
    ))
    .setRpcEndpoint({
        url: assertNotNull(
            process.env.RPC_ETH_HTTP,
            'Ethereum RPC is required but not supplied at RPC_ETH_HTTP'
        ),
        rateLimit: 200
    })
    .setFinalityConfirmation(75)
    .setFields({
        transaction: {
            from: true,
            value: true,
            hash: true,
        },
    })
    .setBlockRange({
        from: parseInt(process.env.FIRST_BLOCK || '3327417'), // fall back to the oldest ens registry block
        to: 23124003
    })

export const mapper = new mapping.Mapper()
    .add(mapping.ensRegistry)
    .add(mapping.ensRegistryOld)
    .add(mapping.baseRegistrar)
    .add(mapping.nameWrapper)
    .add(mapping.ethRegistrarController)
    .add(mapping.ethRegistrarControllerOld)
    .add(mapping.resolver)

mapper.getLogRequests().forEach((req) => {
    processor.addLog(req)
})

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
export type CtxWithCache = ProcessorContext<Store> & {
    queue: SimpleQueue
    esm: EntitySyncManager
}
