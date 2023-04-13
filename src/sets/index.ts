import { structures } from '..'
import { BaseC, BaseN, Context, Data } from '../types'
import { getConnectionsFor, getContextData, getNode, uniqueConnections } from '../utils'
import { Sets } from './types'

export function getSets<N extends BaseN, C extends BaseC>(data: Data<N, C>) {
  const union: Sets<N, C>['union'] = <N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) => {
    const collectionData = getContextData(collection)
    const nodesSet = new Set<BaseN['id']>()

    data.nodes.forEach(n => nodesSet.add(n.id))
    collectionData.nodes.forEach(n => nodesSet.add(n.id))

    const nodes = Array.from(nodesSet.values()).map(id => getNode([...data.nodes, ...collectionData.nodes], id))

    return structures<N | N2, C | C2>({
      nodes,
      connections: getConnectionsFor(nodes, uniqueConnections([...data.connections, ...collectionData.connections]))
    })
  }
  const difference: Sets<N, C>['difference'] = <N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) => {
    const collectionData = getContextData(collection)
    const nodesSet = new Set<BaseN['id']>()

    data.nodes.forEach(n => nodesSet.add(n.id))
    collectionData.nodes.forEach(n => nodesSet.delete(n.id))

    const nodes = Array.from(nodesSet.values()).map(id => getNode(data.nodes, id))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, uniqueConnections([...data.connections, ...collectionData.connections]))
    })
  }
  const intersection: Sets<N, C>['intersection'] = <N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) => {
    const collectionData = getContextData(collection)
    const sourceIds = data.nodes.map(n => n.id)
    const targetIds = collectionData.nodes.map(n => n.id)
    const nodesSet = new Set<BaseN['id']>()

    sourceIds.forEach(id => {
      if (targetIds.includes(id)) nodesSet.add(id)
    })

    const nodes = Array.from(nodesSet.values()).map(id => getNode(data.nodes, id))

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, uniqueConnections([...data.connections, ...collectionData.connections]))
    })
  }

  return {
    union,
    difference,
    intersection
  }
}
