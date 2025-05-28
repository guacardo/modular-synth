// =====================
// Types & Type Aliases
// =====================
type SafeExtract<T, U extends T> = U;

export type Position = [number, number];
export type AudioNodeProperties = Partial<Record<keyof AudioNode, number | string | [number, number]>>;

export type AudioNodeType = "oscillator" | "gain" | "biquad-filter" | "audio-destination";
type AudioProcessorNode = SafeExtract<AudioNodeType, "biquad-filter" | "gain">;
type AudioSourceNode = SafeExtract<AudioNodeType, "oscillator">;
type AudioDestinationNode = SafeExtract<AudioNodeType, "audio-destination">;

// =====================
// Audio Node Constants
// =====================
export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["gain", "biquad-filter"] as const;
export const AUDIO_SOURCE_NODES: AudioSourceNode[] = ["oscillator"] as const;
export const AUDIO_DESTINATION_NODES: AudioDestinationNode[] = ["audio-destination"] as const;

// =====================
// Audio Context & Factory
// =====================
// TODO: Lit will not update if properties update, can only use methods.
export const AUDIO_CONTEXT = new AudioContext();

export const nodeFactory: Record<AudioNodeType, () => AudioNode> = {
    oscillator: () => AUDIO_CONTEXT.createOscillator(),
    gain: () => AUDIO_CONTEXT.createGain(),
    "biquad-filter": () => AUDIO_CONTEXT.createBiquadFilter(),
    "audio-destination": () => AUDIO_CONTEXT.destination,
};

// =====================
// AudioGraphNode Class
// =====================
export class AudioGraphNode {
    id: string;
    position: Position;
    node: AudioNode;
    type: AudioNodeType;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(type: AudioNodeType, position: Position, id: string) {
        this.node = nodeFactory[type]();
        this.position = position;
        this.id = id;
        this.type = type;
    }
}

// =====================
// Utility Functions
// =====================
// TYPE GUARDS
export function isAudioProcessorNode(type: AudioNodeType): type is AudioProcessorNode {
    return (AUDIO_PROCESSOR_NODES as readonly string[]).includes(type);
}

export function isAudioSourceNode(type: AudioNodeType): type is AudioSourceNode {
    return (AUDIO_SOURCE_NODES as readonly string[]).includes(type);
}

export function isAudioDestinationNode(type: AudioNodeType): type is AudioDestinationNode {
    return (AUDIO_DESTINATION_NODES as readonly string[]).includes(type);
}

// UPDATE AUDIO PARAMS
export function updateAudioParamValue<T extends AudioNode>(node: T, properties: AudioNodeProperties): AudioNode {
    for (const [property, value] of Object.entries(properties)) {
        if (property in node) {
            const propKey = property as keyof T;
            if (node[propKey] instanceof AudioParam) {
                if (Array.isArray(value)) {
                    const [targetValue, rampTime] = value;
                    node[propKey].linearRampToValueAtTime(targetValue, AUDIO_CONTEXT.currentTime + rampTime);
                } else if (typeof value === "number") {
                    node[propKey].setValueAtTime(value, AUDIO_CONTEXT.currentTime);
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
