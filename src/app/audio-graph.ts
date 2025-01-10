// audio graph node types
export const nodeTypes = ["osc", "gain", "biquad"] as const;
export type NodeType = (typeof nodeTypes)[number];

export interface Connection {
    sourceId: string;
    destinationId: string;
}

export interface AudioChangeDetail {
    node: GraphNode;
    value: number | string | [number, number];
}

export class GraphNode {
    id: string;
    type: NodeType;
    audioNode: OscillatorNode | GainNode | BiquadFilterNode | AudioDestinationNode;

    constructor(key: string, type: NodeType, context: AudioContext) {
        this.id = `${type}_${key}`;
        this.type = type;

        switch (type) {
            case `gain`:
                this.audioNode = new GainNode(context);
                break;
            case `osc`:
                this.audioNode = new OscillatorNode(context);
                break;
            case `biquad`:
                this.audioNode = new BiquadFilterNode(context);
                break;
        }
    }
}

export class AudioGraph {
    readonly graphNodes: GraphNode[];
    readonly connections: Connection[];
    readonly context: AudioContext;
    private _count: number;

    constructor(nodes: GraphNode[] = [], connections: Connection[] = []) {
        this.context = new AudioContext();
        this.graphNodes = nodes;
        this.connections = connections;
        this._count = 0;
    }

    addNode(type: NodeType): AudioGraph {
        this._count++;
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            graphNodes: [...this.graphNodes, new GraphNode(this._count.toString(), type, this.context)],
        });
    }

    addConnection(sourceNode: GraphNode, destinationNode: GraphNode): AudioGraph {
        // connect web audio nodes first
        sourceNode.audioNode.connect(destinationNode.audioNode);
        // then copy and update the audio graph
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            connections: [...this.connections, { sourceId: sourceNode.id, destinationId: destinationNode.id }],
        });
    }

    updateAudioNode<T extends AudioNode>(node: T, properties: Partial<Record<keyof T, number | string | [number, number]>>): void {
        if (!node || typeof node !== "object" || !properties) {
            console.error("Invalid node or properties");
            return;
        }

        console.log(node, properties);
        for (const [property, value] of Object.entries(properties)) {
            if (property in node) {
                const propKey = property as keyof T;

                if (node[propKey] instanceof AudioParam) {
                    const audioParam = node[propKey] as unknown as AudioParam;

                    if (Array.isArray(value)) {
                        const [targetValue, rampTime] = value;
                        audioParam.linearRampToValueAtTime(targetValue, this.context.currentTime + rampTime);
                    } else if (typeof Number(value) === "number") {
                        audioParam.setValueAtTime(value, this.context.currentTime);
                    } else {
                        console.error(`Invalid value for AudioParam ${value}`);
                    }
                } else {
                    node[propKey] = value as any;
                }
            } else {
                console.warn(`Property ${property} not found on node`);
            }
        }
    }
}
