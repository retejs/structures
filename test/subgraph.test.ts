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
})
