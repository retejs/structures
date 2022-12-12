import { BaseSchemes, NodeId } from 'rete'

export type BaseN = BaseSchemes['Node'] & { parent?: NodeId }
export type BaseC = BaseSchemes['Connection']
export type Data<N extends BaseN, C extends BaseC> = { nodes: N[], connections: C[] }
export type Context<N extends BaseN, C extends BaseC> =
  | Data<N, C>
  | { getNodes(): N[], getConnections(): C[] }
