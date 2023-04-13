import { getMapping } from './mapping'
import { getSets } from './sets'
import { getSubgraph } from './subgraph'
import { getTraverse } from './traverse'
import { BaseC, BaseN, Context, Structures } from './types'
import { getContextData } from './utils'

export function structures<N extends BaseN, C extends BaseC>(context: Context<N, C>): Structures<N, C> {
  const data = getContextData(context)
  const mapping = getMapping(data)
  const subgraph = getSubgraph(data)
  const traverse = getTraverse(data)
  const sets = getSets(data)

  return {
    mapping,
    subgraph,
    traverse,
    sets,
    ...mapping,
    ...subgraph,
    ...traverse,
    ...sets
  }
}
