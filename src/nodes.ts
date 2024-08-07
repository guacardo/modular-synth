// audio graph node types
export const nodeTypes = ["osc", "gain"] as const;
export type NodeType = (typeof nodeTypes)[number];

export class GraphNode {
    id: string;
    type: NodeType;
    connections: string[];
    audioNode: OscillatorNode | GainNode;

    constructor(key: string, type: NodeType, context: AudioContext, connections: string[] = []) {
        this.id = key;
        this.type = type;
        this.connections = connections;

        switch (type) {
            case `gain`:
                this.audioNode = new GainNode(context);
                break;
            case `osc`:
                this.audioNode = new OscillatorNode(context);
                break;
        }
    }
}

export class AudioGraph {
    readonly graphNodes: GraphNode[];
    readonly context: AudioContext;

    constructor(nodes: GraphNode[]) {
        this.graphNodes = nodes;
        this.context = new AudioContext();
    }

    addNode(type: NodeType): AudioGraph {
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            graphNodes: [...this.graphNodes, new GraphNode("bungus", type, this.context)],
        });
    }
}
