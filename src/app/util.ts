import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";

// =====================
// Types & Type Aliases
// =====================
type SafeExtract<T, U extends T> = U;
export type Position = [number, number];
export type AudioNodeProperties = Partial<
    Record<keyof AudioNode | keyof OscillatorNode | keyof GainNode | keyof BiquadFilterNode | keyof DelayNode, number | [number, number] | OscillatorType>
>;
export type AudioNodeType = "oscillator" | "gain" | "biquad-filter" | "audio-destination" | "delay";
type AudioProcessorNode = SafeExtract<AudioNodeType, "biquad-filter" | "gain" | "delay">;
type AudioSourceNode = SafeExtract<AudioNodeType, "oscillator">;
type AudioGraphDestinationNode = SafeExtract<AudioNodeType, "audio-destination">;
export type AudioParamName = "gain" | "frequency" | "detune" | "Q" | "pan" | "delayTime";

// =====================
// Audio Node Constants
// =====================
export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["gain", "biquad-filter", "delay"] as const;
export const AUDIO_SOURCE_NODES: AudioSourceNode[] = ["oscillator"] as const;
export const AUDIO_DESTINATION_NODES: AudioGraphDestinationNode[] = ["audio-destination"] as const;

// =====================
// Audio Context & Factory
// =====================
// TODO: Lit will not update for properties, can only call functions.
export const AUDIO_CONTEXT = new AudioContext();

// =====================
// AudioGraphNode Classes
// =====================
export interface KeyboardAudioEvent {
    keydown: () => void;
    keyup?: () => void;
}

export interface AudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    node: AudioNode;
    getKeyboardEvents?: (updateNode: (node: AudioGraphNode) => void) => Map<string, KeyboardAudioEvent>;
}

export class GainGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: GainNode;

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: BiquadFilterNode;

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}

export class AudioDestinationGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    isSelected = false;
    node: AudioDestinationNode;

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.destination;
        this.position = position;
        this.id = id;
    }
}

// =====================
// Utility Functions
// =====================

export interface NodeConnectState {
    source?: AudioGraphNode;
    destination?: AudioGraphNode | AudioDestinationNode | AudioParam;
}

export function connectAudioNodes(connection: NodeConnectState): boolean {
    const { source, destination } = connection;
    if (
        destination instanceof OscillatorGraphNode ||
        destination instanceof GainGraphNode ||
        destination instanceof BiquadFilterGraphNode ||
        destination instanceof DelayGraphNode
    ) {
        if (source && destination) {
            if (
                source.node instanceof AudioNode &&
                source.node.numberOfOutputs > 0 &&
                destination.node instanceof AudioNode &&
                destination.node.numberOfInputs > 0
            ) {
                source.node.connect(destination.node);
                return true;
            } else {
                console.error("Invalid nodes for connection");
            }
        } else {
            console.error("Source or destination node is undefined");
        }
        return false;
    } else if (destination instanceof AudioDestinationGraphNode) {
        source?.node.connect(destination.node.context.destination);
        return true;
    } else if (destination instanceof AudioParam) {
        source?.node.connect(destination);
        return true;
    }
    return false;
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
