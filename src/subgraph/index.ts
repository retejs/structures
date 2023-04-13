import { NodeId } from 'rete'

import { structures } from '..'
import { BaseC, BaseN, Data } from '../types'
import { getConnectionsFor, getContextData, getNode } from '../utils'
import { Subgraph } from './types'

export function getSubgraph<N extends BaseN, C extends BaseC>(data: Data<N, C>) {
  const _children = (nodes: N[]) => {
    const ids = nodes.map(n => n.id)

    return data.nodes.filter(n => 'parent' in n && n.parent && ids.includes(n.parent))
  }

  const getChildren: Subgraph<N, C>['children'] = (selector = Boolean) => {
    const nodes = _children(data.nodes.filter(selector))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }

  const getParents: Subgraph<N, C>['children'] = (selector = Boolean) => {
    const nodes = data.nodes.filter(selector)
    const ids = nodes.map(n => n.parent)
    const parents = data.nodes.filter(n => ids.includes(n.id))

    return structures({
      nodes: parents,
      connections: getConnectionsFor(parents, data.connections)
    })
  }

  const _descendants = (nodes: N[], ids: NodeId[]) => {
    const children = nodes.filter(n => 'parent' in n && n.parent && ids.includes(n.parent))
    const result = [...children]

    if (children.length) {
      result.push(..._descendants(nodes, children.map(c => c.id)))
    }

    return result
  }

  const descendants: Subgraph<N, C>['descendants'] = (selector = Boolean) => {
    const nodes = _descendants(data.nodes, data.nodes.filter(selector).map(n => n.id))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }

  const _parents = (ids: NodeId[], local: Data<N, C> = data) => {
    const parentIds = new Set<NodeId>()
    const targetParentIds = new Set(ids.map(id => getNode(local.nodes, id).parent))

    data.nodes.forEach(parent => {
      if (targetParentIds.has(parent.id)) {
        parentIds.add(parent.id)
      }
    })

    if (parentIds.size) {
      const found = _parents(Array.from(parentIds), local)

      found.forEach(id => parentIds.add(id))
    }

    return Array.from(parentIds)
  }

  const getAncestors: Subgraph<N, C>['ancestors'] = (selector = Boolean, localContext) => {
    const local = localContext ? getContextData(localContext) : data
    const ids = _parents(data.nodes.filter(selector).map(n => n.id), local)
    const nodes = ids.map(id => getNode(local.nodes, id))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, local.connections)
    })
  }

  const orphans: Subgraph<N, C>['orphans'] = () => {
    const nodes = data.nodes.filter(n => !n.parent)

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, data.connections)
    })
  }

  return {
    children: getChildren,
    parents: getParents,
    descendants,
    ancestors: getAncestors,
    orphans
  }
}
