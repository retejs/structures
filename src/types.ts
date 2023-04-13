import { BaseSchemes, NodeId } from 'rete'

import { Mapping } from './mapping/types'
import { Sets } from './sets/types'
import { Subgraph } from './subgraph/types'
import { Traverse } from './traverse/types'

export type BaseN = BaseSchemes['Node'] & { parent?: NodeId }
export type BaseC = BaseSchemes['Connection']
export type Data<N extends BaseN, C extends BaseC> = { nodes: N[], connections: C[] }
export type Context<N extends BaseN, C extends BaseC> =
  | Data<N, C>
  | { getNodes(): N[], getConnections(): C[] }

export type Structures<N extends BaseN, C extends BaseC> =
& Subgraph<N, C>
& Sets<N, C>
& Mapping<N, C>
& Traverse<N, C>
& {
  subgraph: Subgraph<N, C>
  sets: Sets<N, C>
  mapping: Mapping<N, C>
  traverse: Traverse<N, C>
}
