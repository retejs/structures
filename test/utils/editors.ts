import { GetSchemes, NodeEditor } from 'rete'

import { Connection, Node } from '.'

export async function createSequentABC() {
  const editor = new NodeEditor<GetSchemes<Node, Connection>>()

  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')

  await editor.addNode(a)
  await editor.addNode(b)
  await editor.addNode(c)
  await editor.addConnection(new Connection(a, 'output1', b, 'input1'))
  await editor.addConnection(new Connection(a, 'output2', b, 'input2'))
  await editor.addConnection(new Connection(b, 'output1', c, 'input1'))

  return { a, b, c, editor }
}

export async function createCompound() {
  const editor = new NodeEditor<GetSchemes<Node, Connection>>()

  const a = new Node('a')
  const b = new Node('b')
  const c = new Node('c')
  const d = new Node('d')

  a.parent = b.id
  b.parent = c.id

  await editor.addNode(a)
  await editor.addNode(b)
  await editor.addNode(c)
  await editor.addNode(d)

  return { a, b, c, d, editor }
}
