import { structures } from '..'
import { BaseC, BaseN, Data } from '../types'
import { getConnectionsFor } from '../utils'
import { Mapping } from './types'

export function getMapping<N extends BaseN, C extends BaseC>(data: Data<N, C>) {
  const getNodes: Mapping<N, C>['nodes'] = () => {
    return data.nodes
  }
  const getConnections: Mapping<N, C>['connections'] = () => {
    return data.connections
  }
  const filter: Mapping<N, C>['filter'] = (predicateNode, predicateConnection) => {
    const nodes = data.nodes.filter(node => {
      return predicateNode(node)
    })
    const connections = predicateConnection
      ? data.connections.filter(c => {
        return predicateConnection(c)
      })
      : data.connections

    return structures({
      nodes,
      connections: getConnectionsFor(nodes, connections)
    })
  }

  return {
    nodes: getNodes,
    connections: getConnections,
    filter
  }
}
