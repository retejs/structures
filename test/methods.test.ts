import { describe, expect, it } from '@jest/globals'

import { structures } from '../src'
import { Node } from './utils'
import { createCompound, createSequentABC } from './utils/editors'

// eslint-disable-next-line max-statements
describe('methods', () => {
    it('outgoers', async () => {
        const { a, b, c, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.outgoers(a.id).nodes()).toHaveLength(1)
        expect(graph.outgoers(b.id).nodes()).toHaveLength(1)
        expect(graph.outgoers(c.id).nodes()).toHaveLength(0)
    })

    it('incomers', async () => {
        const { a, b, c, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.incomers(a.id).nodes()).toHaveLength(0)
        expect(graph.incomers(b.id).nodes()).toHaveLength(1)
        expect(graph.incomers(c.id).nodes()).toHaveLength(1)
    })

    it('roots', async () => {
        const { a, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.roots().nodes()).toHaveLength(1)
        expect(graph.roots().nodes().map(n => n.id)).toEqual([a.id])
    })

    it('leaves', async () => {
        const { c, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.leaves().nodes()).toHaveLength(1)
        expect(graph.leaves().nodes().map(n => n.id)).toEqual([c.id])
    })

    it('successors', async () => {
        const { a, b, c, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.successors(a.id).nodes()).toHaveLength(2)
        expect(graph.successors(a.id).nodes().map(n => n.id).sort()).toEqual([b.id, c.id].sort())
        expect(graph.successors(b.id).nodes()).toHaveLength(1)
        expect(graph.successors(b.id).nodes().map(n => n.id)).toEqual([c.id])
        expect(graph.successors(c.id).nodes()).toHaveLength(0)
    })

    it('predecessors', async () => {
        const { a, b, c, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.predecessors(c.id).nodes()).toHaveLength(2)
        expect(graph.predecessors(c.id).nodes().map(n => n.id).sort()).toEqual([a.id, b.id].sort())
        expect(graph.predecessors(b.id).nodes()).toHaveLength(1)
        expect(graph.predecessors(b.id).nodes().map(n => n.id)).toEqual([a.id])
        expect(graph.predecessors(a.id).nodes()).toHaveLength(0)
    })

    it('union', async () => {
        const { a, editor } = await createSequentABC()
        const graph = structures(editor)
        const d = new Node('d')

        expect(graph.union(editor).nodes()).toHaveLength(3)
        expect(graph.union({ nodes: [d], connections: [] }).nodes()).toHaveLength(4)
        expect(graph.union({ nodes: [a], connections: [] }).nodes()).toHaveLength(3)
    })

    it('difference', async () => {
        const { a, editor } = await createSequentABC()
        const graph = structures(editor)
        const d = new Node('d')

        expect(graph.difference(editor).nodes()).toHaveLength(0)
        expect(graph.difference({ nodes: [d], connections: [] }).nodes()).toHaveLength(3)
        expect(graph.difference({ nodes: [a], connections: [] }).nodes()).toHaveLength(2)
        expect(graph.difference({ nodes: [a], connections: [] }).connections()).toHaveLength(1)
    })

    it('intersection', async () => {
        const { a, editor } = await createSequentABC()
        const graph = structures(editor)
        const d = new Node('d')

        expect(graph.intersection(editor).nodes()).toHaveLength(3)
        expect(graph.intersection({ nodes: [d], connections: [] }).nodes()).toHaveLength(0)
        expect(graph.intersection({ nodes: [a], connections: [] }).nodes()).toHaveLength(1)
        expect(graph.intersection({ nodes: [a], connections: [] }).connections()).toHaveLength(0)
    })

    it('filter', async () => {
        const { b, editor } = await createSequentABC()
        const graph = structures(editor)

        expect(graph.filter(n => n.id !== b.id).nodes()).toHaveLength(2)
        expect(graph.filter(n => n.id !== b.id).connections()).toHaveLength(0)
    })

    it('children', async () => {
        const { a, b, editor } = await createCompound()
        const graph = structures(editor)

        expect(graph.children().nodes()).toHaveLength(2)
        expect(graph.children().nodes().map(n => n.id).sort()).toEqual([a.id, b.id].sort())
    })

    it('parents', async () => {
        const { a, b, c, editor } = await createCompound()
        const graph = structures(editor)

        expect(graph.parents().nodes()).toHaveLength(2)
        expect(graph.parents(n => n.id === a.id).nodes().map(n => n.id)).toEqual([b.id, c.id])
        expect(graph.parents(n => n.id === b.id).nodes().map(n => n.id)).toEqual([c.id])
    })
})
