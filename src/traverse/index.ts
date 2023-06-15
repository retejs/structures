import { NodeId } from 'rete'

import { structures } from '..'
import { BaseC, BaseN, Data } from '../types'
import { getConnectionsFor, getNode } from '../utils'
import { Traverse } from './types'

export function getTraverse<N extends BaseN, C extends BaseC>(data: Data<N, C>) {
  const leaves: Traverse<N, C>['leaves'] = () => {
    const sources = data.connections.map(c => c.source)
    const nodes = data.nodes
      .filter(n => !(sources.length && sources.includes(n.id)))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }
  const roots: Traverse<N, C>['roots'] = () => {
    const targets = data.connections.map(c => c.target)
    const nodes = data.nodes
      .filter(n => !(targets.length && targets.includes(n.id)))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }
  const incomers: Traverse<N, C>['incomers'] = (id, selector = Boolean) => {
    const nodes = data.connections
      .filter(c => {
        const match = c.target === id

        if (selector === Boolean) return match
        const node = data.nodes.find(n => n.id === c.source)

        if (!node) throw new Error('node')

        return match && selector(node, c)
      })
      .map(c => {
        const node = data.nodes.find(n => n.id === c.source)

        if (!node) throw new Error('node')
        return node
      })
    const uniqueNodes = Array.from(new Set(nodes))

    return structures({
      nodes: uniqueNodes,
      connections: getConnectionsFor(uniqueNodes, data.connections)
    })
  }
  const outgoers: Traverse<N, C>['outgoers'] = (id, selector = Boolean) => {
    const nodes = data.connections
      .filter(c => {
        const match = c.source === id

        if (selector === Boolean) return match
        const node = data.nodes.find(n => n.id === c.target)

        if (!node) throw new Error('node')

        return match && selector(node, c)
      })
      .map(c => {
        const node = data.nodes.find(n => n.id === c.target)

        if (!node) throw new Error('node')
        return node
      })
    const uniqueNodes = Array.from(new Set(nodes))

    return structures({
      nodes: uniqueNodes,
      connections: getConnectionsFor(uniqueNodes, data.connections)
    })
  }
  const collectSuccessors = (id: NodeId, set: Set<N['id']>, selector: (node: N, con: C) => boolean) => {
    for (const item of outgoers(id, selector).nodes()) {
      if (!set.has(item.id)) {
        set.add(item.id)
        collectSuccessors(item.id, set, selector)
      }
    }
  }
  const successors: Traverse<N, C>['successors'] = (id, selector = Boolean) => {
    const nodesSet = new Set<N['id']>()

    collectSuccessors(id, nodesSet, selector)

    const nodes = Array.from(nodesSet.values()).map(nodeId => getNode(data.nodes, nodeId))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }
  const collectPredecessors = (id: NodeId, set: Set<N['id']>, selector: (node: N, con: C) => boolean) => {
    for (const item of incomers(id, selector).nodes()) {
      if (!set.has(item.id)) {
        set.add(item.id)
        collectPredecessors(item.id, set, selector)
      }
    }
  }
  const predecessors: Traverse<N, C>['predecessors'] = (id, selector = Boolean) => {
    const nodesSet = new Set<N['id']>()

    collectPredecessors(id, nodesSet, selector)

    const nodes = Array.from(nodesSet.values()).map(nodeId => getNode(data.nodes, nodeId))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }

  return {
    roots,
    leaves,
    incomers,
    outgoers,
    successors,
    predecessors
  }
}
