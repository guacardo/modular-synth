// audio graph node types
export const nodeTypes = ["osc", "gain"] as const;
export type NodeType = (typeof nodeTypes)[number];

export interface Connection {
    sourceId: string;
    destinationId: string;
}

export class GraphNode {
    id: string;
    type: NodeType;
    connections: Connection[];
    audioNode: OscillatorNode | GainNode | AudioDestinationNode;

    constructor(key: string, type: NodeType, context: AudioContext, connections: Connection[] = []) {
        this.id = `${type}_${key}`;
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
    private _count: number;

    constructor(nodes: GraphNode[]) {
        this.context = new AudioContext();
        this.graphNodes = nodes;
        this._count = 0;
    }

    addNode(type: NodeType): AudioGraph {
        this._count++;
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            graphNodes: [...this.graphNodes, new GraphNode(this._count.toString(), type, this.context)],
        });
    }
}
