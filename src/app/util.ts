import { getAudioContext } from "./audio-context";

export type SafeExtract<T, U extends T> = U;
export type Position = [number, number];
export type AudioNodeProperties = Partial<
    Record<
        keyof AudioNode | keyof OscillatorNode | keyof GainNode | keyof BiquadFilterNode | keyof DelayNode | keyof StereoPannerNode,
        number | [number, number] | OscillatorType
    >
>;
export type AudioNodeType = "oscillator" | "gain" | "biquad-filter" | "audio-destination" | "delay" | "stereo-panner" | "delay-deny-compose";
type AudioProcessorNode = SafeExtract<AudioNodeType, "biquad-filter" | "gain" | "delay" | "stereo-panner">;
type AudioSourceNode = SafeExtract<AudioNodeType, "oscillator">;
type AudioGraphDestinationNode = SafeExtract<AudioNodeType, "audio-destination">;
type AudioSuperNode = SafeExtract<AudioNodeType, "delay-deny-compose">;

export type AudioParamName = "gain" | "frequency" | "detune" | "Q" | "delayTime" | "pan";

export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["biquad-filter", "delay", "gain", "stereo-panner"] as const;
export const AUDIO_SOURCE_NODES: AudioSourceNode[] = ["oscillator"] as const;
export const AUDIO_DESTINATION_NODES: AudioGraphDestinationNode[] = ["audio-destination"] as const;
export const AUDIO_SUPER_NODES: AudioSuperNode[] = ["delay-deny-compose"] as const;

export interface KeyboardAudioEvent {
    keydown: () => void;
    keyup?: () => void;
}

export interface ImmutableRepository<T> {
    add: (...args: any[]) => T[];
    remove: (item: T) => T[];
    update: (item: T) => T[];
    findById(id: string): T | undefined;
    getAll: () => T[];
}

export interface NodeConnectState {
    source?: AudioGraphNode;
    destination?: AudioGraphNode | AudioDestinationNode | AudioParam;
}

export interface AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: AudioNode;
    getKeyboardEvents?: (updateNode: (node: AudioGraphNode) => void) => Map<string, KeyboardAudioEvent>;
    connectTo?: (target: AudioGraphNode | AudioParam, paramName?: AudioParamName) => boolean;
}

export function updateAudioParamValue<T extends AudioNode>(node: T, properties: AudioNodeProperties): AudioNode {
    const audioContext = getAudioContext();

    for (const [property, value] of Object.entries(properties)) {
        if (property in node) {
            const propKey = property as keyof T;
            if (node[propKey] instanceof AudioParam) {
                if (Array.isArray(value)) {
                    const [targetValue, rampTime] = value;
                    node[propKey].linearRampToValueAtTime(targetValue, audioContext.currentTime + rampTime);
                } else if (typeof value === "number") {
                    node[propKey].setValueAtTime(value, audioContext.currentTime);
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
