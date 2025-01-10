// audio graph node types
export const nodeTypes = ["osc", "gain", "biquad"] as const;
export type NodeType = (typeof nodeTypes)[number];

export class AudioGraph {
    readonly audioNodes: AudioNode[];
    readonly context: AudioContext;
    private _count: number;

    constructor() {
        this.context = new AudioContext();
        this.audioNodes = [];
        this._count = 0;
    }

    addNode(node: AudioNode): AudioGraph {
        this._count++;
        return Object.assign(Object.create(AudioGraph.prototype), {
            ...this,
            audioNodes: [...this.audioNodes, node],
        });
    }

    updateAudioNode<T extends AudioNode>(node: T, properties: Partial<Record<keyof T, number | string | [number, number]>>): void {
        if (!node || typeof node !== "object" || !properties) {
            console.error("Invalid node or properties");
            return;
        }

        for (const [property, value] of Object.entries(properties)) {
            if (property in node) {
                const propKey = property as keyof T;

                if (node[propKey] instanceof AudioParam) {
                    const audioParam = node[propKey] as unknown as AudioParam;

                    if (Array.isArray(value)) {
                        const [targetValue, rampTime] = value;
                        audioParam.linearRampToValueAtTime(targetValue, this.context.currentTime + rampTime);
                    } else if (typeof value === "number") {
                        audioParam.setValueAtTime(value, this.context.currentTime);
                        console.log(node);
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
