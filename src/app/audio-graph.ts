// audio graph node types
export const nodeTypes = ["osc", "gain", "biquad"] as const;
export type NodeType = (typeof nodeTypes)[number];

export class AudioGraph {
    readonly audioNodes: AudioNode[];
    readonly context: AudioContext;

    constructor() {
        this.context = new AudioContext();
        this.audioNodes = [];
    }

    addNode(node: AudioNode): AudioGraph {
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            audioNodes: [...this.audioNodes, node],
        });
    }

    setAudioNodes(audioNodes: AudioNode[]): AudioGraph {
        console.log("audioGraph.setAudioNodes", audioNodes);
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            audioNodes,
        });
    }

    updateAudioNode<T extends AudioNode>(
        node: T,
        properties: Partial<Record<keyof T, number | string | [number, number]>>
    ): AudioNode | undefined {
        if (!node || typeof node !== "object" || !properties) {
            console.error("Invalid node or properties");
            return;
        }

        for (const [property, value] of Object.entries(properties)) {
            if (property in node) {
                const propKey = property as keyof T;
                if (node[propKey] instanceof AudioParam) {
                    if (Array.isArray(value)) {
                        const [targetValue, rampTime] = value;
                        node[propKey].linearRampToValueAtTime(targetValue, this.context.currentTime + rampTime);
                    } else if (typeof value === "number") {
                        node[propKey].setValueAtTime(value, this.context.currentTime);
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

        return node;
    }
}
