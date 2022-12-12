import { NodeId } from 'rete'

import { BaseC, BaseN, Context, Data } from './types'
import { getConnectionsFor, getContextData, getNode, uniqueConnections } from './utils'

type Structures<N extends BaseN, C extends BaseC> = {
    nodes(): N[]
    connections(): C[]
    roots(): Structures<N, C>
    leaves(): Structures<N, C>
    incomers(id: NodeId): Structures<N, C>
    outgoers(id: NodeId): Structures<N, C>
    successors(id: NodeId): Structures<N, C>
    predecessors(id: NodeId): Structures<N, C>
    union<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
    difference<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
    intersection<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>): Structures<N | N2, C | C2>
    children(): Structures<N, C>
    descendants(): Structures<N, C>
    parents(selector?: (node: N) => boolean, localContext?: Context<N, C>): Structures<N, C>
    orphans(): Structures<N, C>
    filter(predicateNode: (node: N) => boolean, predicateConnection?: (connection: C) => boolean): Structures<N, C>
}

// eslint-disable-next-line max-len, max-statements
export function structures<N extends BaseN, C extends BaseC>(context: Context<N, C>): Structures<N, C> {
    const data = getContextData(context)

    function getNodes() {
        return data.nodes
    }
    function getConnections() {
        return data.connections
    }
    function leaves() {
        const sources = data.connections.map(c => c.source)
        const nodes = data.nodes
            .filter(n => !(sources.length && sources.includes(n.id)))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function roots() {
        const targets = data.connections.map(c => c.target)
        const nodes = data.nodes
            .filter(n => !(targets.length && targets.includes(n.id)))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function incomers(id: NodeId) {
        const nodes = data.connections
            .filter(c => c.target === id)
            .map(c => {
                const node = data.nodes.find(n => n.id === c.source)

                if (!node) throw new Error('node')
                return node
            })

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function outgoers(id: NodeId) {
        const nodes = data.connections
            .filter(c => c.source === id)
            .map(c => {
                const node = data.nodes.find(n => n.id === c.target)

                if (!node) throw new Error('node')
                return node
            })

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function collectSuccessors(id: NodeId, set: Set<N['id']>) {
        for (const item of outgoers(id).nodes()) {
            if (!set.has(item.id)) {
                set.add(item.id)
                collectSuccessors(item.id, set)
            }
        }
    }
    function successors(id: NodeId) {
        const nodesSet = new Set<N['id']>()

        collectSuccessors(id, nodesSet)

        const nodes = Array.from(nodesSet.values()).map(nodeId => getNode(data.nodes, nodeId))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function collectPredecessors(id: NodeId, set: Set<N['id']>) {
        for (const item of incomers(id).nodes()) {
            if (!set.has(item.id)) {
                set.add(item.id)
                collectPredecessors(item.id, set)
            }
        }
    }
    function predecessors(id: NodeId) {
        const nodesSet = new Set<N['id']>()

        collectPredecessors(id, nodesSet)

        const nodes = Array.from(nodesSet.values()).map(nodeId => getNode(data.nodes, nodeId))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function union<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) {
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
    function difference<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) {
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
    function intersection<N2 extends BaseN, C2 extends BaseC>(collection: Context<N2, C2>) {
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
    function _children(nodes: N[]) {
        const ids = nodes.map(n => n.id)

        return nodes.filter(n => 'parent' in n && n.parent && ids.includes(n.parent))
    }
    function getChildren() {
        const nodes = _children(data.nodes)

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function _descendants(nodes: N[], ids: NodeId[]) {
        const children = nodes.filter(n => 'parent' in n && n.parent && ids.includes(n.parent))
        const result = [...children]

        result.push(..._descendants(nodes, children.map(c => c.id)))

        return result
    }
    function descendants() {
        const nodes = _descendants(data.nodes, data.nodes.map(n => n.id))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })
    }
    function _parents(ids: NodeId[], local: Data<N, C> = data) {
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

    function getParents(selector: (node: N) => boolean = Boolean, localContext?: Context<N, C>) {
        const local = localContext ? getContextData(localContext) : data
        const ids = _parents(data.nodes.filter(selector).map(n => n.id), local)
        const nodes = ids.map(id => getNode(local.nodes, id))

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, local.connections)
        })
    }
    function orphans() {
        const nodes = data.nodes.filter(n => !n.parent)

        return structures({
            nodes,
            connections: getConnectionsFor(nodes, data.connections)
        })

    }
    function filter(predicateNode: (node: N) => boolean, predicateConnection?: (connection: C) => boolean) {
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
        roots,
        leaves,
        incomers,
        outgoers,
        successors,
        predecessors,
        union,
        difference,
        intersection,
        children: getChildren,
        descendants,
        parents: getParents,
        orphans,
        filter
    }
}
