import { BaseC, BaseN, Structures } from '../types'

export type Subgraph<N extends BaseN, C extends BaseC> = {
  children(selector?: (node: N) => boolean): Structures<N, C>
  parents(selector?: (node: N) => boolean): Structures<N, C>
  descendants(selector?: (node: N) => boolean): Structures<N, C>
  ancestors(selector?: (node: N) => boolean): Structures<N, C>
  orphans(): Structures<N, C>
  siblings(selector?: (node: N) => boolean): Structures<N, C>
}

