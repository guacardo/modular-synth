import { AudioDestinationGraphNode } from "../components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { GainGraphNode } from "../components/audio-nodes/processing/gain-node/gain-graph-node";
import { StereoPannerGraphNode } from "../components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { DelayDenyComposeGraphNode } from "../components/audio-nodes/super/delay-deny-compose/delay-deny-compose-node";

// =====================
// Types & Type Aliases
// =====================
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

export type AudioParamName = "gain" | "frequency" | "detune" | "Q" | "pan" | "delayTime" | "pan";

// =====================
// Audio Node Constants
// =====================
export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["biquad-filter", "delay", "gain", "stereo-panner"] as const;
export const AUDIO_SOURCE_NODES: AudioSourceNode[] = ["oscillator"] as const;
export const AUDIO_DESTINATION_NODES: AudioGraphDestinationNode[] = ["audio-destination"] as const;
export const AUDIO_SUPER_NODES: AudioSuperNode[] = ["delay-deny-compose"] as const;

// TODO: Lit will not update for properties, can only call functions.
// TODO: might be a good idea to "close()" the AudioContext whenever we load a new audio graph to prevent memory leaks.
export const AUDIO_CONTEXT = new AudioContext();

export interface KeyboardAudioEvent {
    keydown: () => void;
    keyup?: () => void;
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
}

// =====================
// Utility Functions
// =====================

export interface NodeConnectState {
    source?: AudioGraphNode;
    destination?: AudioGraphNode | AudioDestinationNode | AudioParam;
}

export const isConnectableGraphNode = (
    node: unknown
): node is BiquadFilterGraphNode | GainGraphNode | OscillatorGraphNode | DelayGraphNode | StereoPannerGraphNode | DelayDenyComposeGraphNode => {
    return [BiquadFilterGraphNode, GainGraphNode, OscillatorGraphNode, DelayGraphNode, StereoPannerGraphNode, DelayDenyComposeGraphNode].some(
        (Ctor) => node instanceof Ctor
    );
};

export function connectAudioNodes(connection: NodeConnectState): boolean {
    const { source, destination } = connection;
    if (
        destination instanceof OscillatorGraphNode ||
        destination instanceof GainGraphNode ||
        destination instanceof BiquadFilterGraphNode ||
        destination instanceof DelayGraphNode ||
        destination instanceof StereoPannerGraphNode
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
