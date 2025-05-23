export type Position = [number, number];
export type AudioNodeType = "oscillator" | "gain" | "biquad-filter";
export type AudioSourceNode = Extract<AudioNodeType, "oscillator">;
export type AudioProcessorNode = Extract<AudioNodeType, "gain" | "biquad-filter">;
export type AudioNodeProperties = Partial<Record<keyof AudioNode, number | string | [number, number]>>;
export class AudioGraphNode {
    id: string;
    position: Position;
    node: AudioNode;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(id: string, position: Position, node: AudioNode) {
        this.id = id;
        this.position = position;
        this.node = node;
    }
}

export function updateAudioParamValue<T extends AudioNode>(node: T, properties: AudioNodeProperties, context: AudioContext): AudioNode {
    for (const [property, value] of Object.entries(properties)) {
        if (property in node) {
            const propKey = property as keyof T;
            if (node[propKey] instanceof AudioParam) {
                if (Array.isArray(value)) {
                    const [targetValue, rampTime] = value;
                    node[propKey].linearRampToValueAtTime(targetValue, context.currentTime + rampTime);
                } else if (typeof value === "number") {
                    node[propKey].setValueAtTime(value, context.currentTime);
                    node[propKey].value = value;
                } else {
                    console.error(`Invalid value for AudioParam ${value}`);
                }
            } else if (property === "type" && value) {
                node[propKey] = value as any;
            }
        } else {
            console.warn(`Property ${property} not found on node`);
        }
    }

    return node;
}
