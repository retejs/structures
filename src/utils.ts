import { NodeId } from 'rete'

import { BaseC, BaseN, Context } from './types'

export function getContextData<N extends BaseN, C extends BaseC>(context: Context<N, C>) {
    return 'nodes' in context
        ? context
        : { nodes: context.getNodes(), connections: context.getConnections() }
}

export function getNode<N extends BaseN>(list: N[], id: NodeId) {
    const node = list.find(n => n.id === id)

    if (!node) throw new Error('node')
    return node
}

export function getConnection<C extends BaseC>(list: C[], id: NodeId) {
    const node = list.find(n => n.id === id)

    if (!node) throw new Error('connection')
    return node
}

export function uniqueConnections<C extends BaseC>(connections: C[]) {
    const ids = new Set<C['id']>()

    connections.forEach(c => ids.add(c.id))

    return Array.from(ids).map(id => getConnection(connections, id))
}

export function getConnectionsFor<N extends BaseN, C extends BaseC>(nodes: N[], connections: C[]) {
    const ids = Array.from(nodes).map(n => n.id)

    return connections.filter(c => ids.includes(c.source) && ids.includes(c.target))
}
