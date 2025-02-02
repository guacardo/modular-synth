import { AudioNodeWithId } from "./util";

export class AudioGraph {
    readonly audioNodes: AudioNode[];
    readonly context: AudioContext;
    createIndex: number;

    constructor() {
        this.context = new AudioContext();
        this.audioNodes = [];
        this.createIndex = 0;
    }

    addNode(nodeConstructor: new (context: AudioContext) => AudioNodeWithId): AudioGraph;
    addNode(node: AudioNodeWithId): AudioGraph;
    addNode(arg: any): AudioGraph {
        let node: AudioNodeWithId;
        if (typeof arg === "function") {
            node = new arg(this.context);
            node.id = (++this.createIndex).toString();
        } else {
            node = arg;
        }
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            audioNodes: [...this.audioNodes, node],
        });
    }

    findOrAddNode(node?: AudioNode): AudioGraph {
        const index = this.audioNodes.findIndex((n) => n === node);

        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            audioNodes: this.audioNodes.map((n, i) => (i === index ? node : n)),
        });
    }

    updateAudioParamValue<T extends AudioNode>(
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
                        node[propKey].value = value;
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
