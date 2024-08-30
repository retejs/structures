import { describe, expect, it } from '@jest/globals'

import { structures } from '../src'
import { createSequentABC } from './utils/editors'

describe('Traverse', () => {
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
    expect(graph.roots().nodes()
      .map(n => n.id)).toEqual([a.id])
  })

  it('leaves', async () => {
    const { c, editor } = await createSequentABC()
    const graph = structures(editor)

    expect(graph.leaves().nodes()).toHaveLength(1)
    expect(graph.leaves().nodes()
      .map(n => n.id)).toEqual([c.id])
  })

  it('successors', async () => {
    const { a, b, c, editor } = await createSequentABC()
    const graph = structures(editor)

    expect(graph.successors(a.id).nodes()).toHaveLength(2)
    expect(graph.successors(a.id).nodes()
      .map(n => n.id)
      .sort()).toEqual([b.id, c.id].sort())
    expect(graph.successors(b.id).nodes()).toHaveLength(1)
    expect(graph.successors(b.id).nodes()
      .map(n => n.id)).toEqual([c.id])
    expect(graph.successors(c.id).nodes()).toHaveLength(0)
  })

  it('predecessors', async () => {
    const { a, b, c, editor } = await createSequentABC()
    const graph = structures(editor)

    expect(graph.predecessors(c.id).nodes()).toHaveLength(2)
    expect(graph.predecessors(c.id).nodes()
      .map(n => n.id)
      .sort()).toEqual([a.id, b.id].sort())
    expect(graph.predecessors(b.id).nodes()).toHaveLength(1)
    expect(graph.predecessors(b.id).nodes()
      .map(n => n.id)).toEqual([a.id])
    expect(graph.predecessors(a.id).nodes()).toHaveLength(0)
  })
})
