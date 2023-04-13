import { BaseC, BaseN, Context, Structures } from '../types'

export type Sets<N extends BaseN, C extends BaseC> = {
  union<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
  difference<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
  intersection<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
}
