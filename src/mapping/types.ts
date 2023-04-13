import { BaseC, BaseN, Structures } from '../types'

export type Mapping<N extends BaseN, C extends BaseC> = {
  nodes(): N[]
  connections(): C[]
  filter(predicateNode: (node: N) => boolean, predicateConnection?: (connection: C) => boolean): Structures<N, C>
}
