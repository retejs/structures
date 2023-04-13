/* eslint-env node */
import { describe, expect, it } from '@jest/globals'

import { structures } from '../src'
import { createSequentABC } from './utils/editors'

describe('Mapping', () => {
  it('filter', async () => {
    const { b, editor } = await createSequentABC()
    const graph = structures(editor)

    expect(graph.filter(n => n.id !== b.id).nodes()).toHaveLength(2)
    expect(graph.filter(n => n.id !== b.id).connections()).toHaveLength(0)
  })
})
