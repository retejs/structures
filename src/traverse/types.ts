
import { NodeId } from 'rete'

import { BaseC, BaseN, Structures } from '../types'

export type Traverse<N extends BaseN, C extends BaseC> = {
  roots(): Structures<N, C>
  leaves(): Structures<N, C>
  incomers(id: NodeId, selector?: (node: N, connection: C) => boolean): Structures<N, C>
  outgoers(id: NodeId, selector?: (node: N, connection: C) => boolean): Structures<N, C>
  successors(id: NodeId, selector?: (node: N, connection: C) => boolean): Structures<N, C>
  predecessors(id: NodeId, selector?: (node: N, connection: C) => boolean): Structures<N, C>
}
