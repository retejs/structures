import { ClassicPreset, NodeId } from 'rete'

const socket = new ClassicPreset.Socket('a')

export class Node extends ClassicPreset.Node<
  { input1: ClassicPreset.Socket, input2: ClassicPreset.Socket },
  { output1: ClassicPreset.Socket, output2: ClassicPreset.Socket }
> {
    parent?: NodeId

    constructor(label: string) {
        super(label)

        this.addInput('input1', new ClassicPreset.Input(socket))
        this.addInput('input2', new ClassicPreset.Input(socket))
        this.addOutput('output1', new ClassicPreset.Output(socket))
        this.addOutput('output2', new ClassicPreset.Output(socket))
    }
}

export class Connection extends ClassicPreset.Connection<Node, Node> {}
