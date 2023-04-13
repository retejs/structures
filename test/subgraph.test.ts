/* eslint-env node */
import { describe, expect, it } from '@jest/globals'

import { structures } from '../src'
import { createCompound } from './utils/editors'

describe('Subgraph', () => {
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

  it('orphans', async () => {
    const { c, d, editor } = await createCompound()
    const graph = structures(editor)

    expect(graph.orphans().nodes()).toHaveLength(2)
    expect(graph.orphans().nodes().map(n => n.id).sort()).toEqual([c.id, d.id].sort())
  })

  it('descendants', async () => {
    const { a, b, c, d, editor } = await createCompound()
    const graph = structures(editor)

    expect(graph.descendants(n => n.id === c.id).nodes()).toHaveLength(2)
    expect(graph.descendants(n => n.id === c.id).nodes().map(n => n.id).sort()).toEqual([a.id, b.id].sort())
    expect(graph.descendants(n => n.id === b.id).nodes()).toHaveLength(1)
    expect(graph.descendants(n => n.id === b.id).nodes().map(n => n.id)).toEqual([a.id])
    expect(graph.descendants(n => n.id === d.id).nodes()).toHaveLength(0)
  })
})
