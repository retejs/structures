/* eslint-env node */
import { describe, expect, it } from '@jest/globals'

import { structures } from '../src'
import { Node } from './utils'
import { createSequentABC } from './utils/editors'

describe('Sets', () => {
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
})
