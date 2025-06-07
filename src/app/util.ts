// =====================
// Types & Type Aliases
// =====================
type SafeExtract<T, U extends T> = U;
export type Position = [number, number];
export type AudioNodeProperties = Partial<Record<keyof AudioNode, number | string | [number, number]>>;
export type AudioNodeType = "oscillator" | "gain" | "biquad-filter" | "audio-destination";
type AudioProcessorNode = SafeExtract<AudioNodeType, "biquad-filter" | "gain">;
type AudioSourceNode = SafeExtract<AudioNodeType, "oscillator">;
type AudioGraphDestinationNode = SafeExtract<AudioNodeType, "audio-destination">;

// =====================
// Audio Node Constants
// =====================
export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["gain", "biquad-filter"] as const;
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
    key: string;
    keydown: () => void;
    keyup?: () => void;
    pressed?: boolean;
}

export interface AudioGraphNode {
    id: string;
    position: Position;
    node: AudioNode;
    inputIds: string[];
    outputIds: string[];
}

export class OscillatorGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    node: OscillatorNode;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createOscillator();
        this.position = position;
        this.id = id;
    }
}

export class GainGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    node: GainNode;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createGain();
        this.position = position;
        this.id = id;
    }
}

export class BiquadFilterGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    node: BiquadFilterNode;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.createBiquadFilter();
        this.position = position;
        this.id = id;
    }
}

export class AudioDestinationGraphNode implements AudioGraphNode {
    id: string;
    position: Position;
    node: AudioDestinationNode;
    inputIds: string[] = [];
    outputIds: string[] = [];

    constructor(context: AudioContext, position: Position, id: string) {
        this.node = context.destination;
        this.position = position;
        this.id = id;
    }
}

// =====================
// Utility Functions
// =====================
export function connectAudioNodes(connection: NodeConnectState): boolean {
    const { source, destination } = connection;
    if (
        destination instanceof OscillatorGraphNode ||
        destination instanceof GainGraphNode ||
        destination instanceof BiquadFilterGraphNode
    ) {
        console.log("Connecting nodes:", source?.id, destination?.id);
        if (source && destination) {
            if (
                source.node instanceof AudioNode &&
                source.node.numberOfOutputs > 0 &&
                destination.node instanceof AudioNode &&
                destination.node.numberOfInputs > 0
            ) {
                source.node.connect(destination.node);
                /* TODO: this won't update state. need to do it in Lit context
                source.outputIds.push(destination.id);
                destination.inputIds.push(source.id);
                */
                console.log(`Connected ${source.id} to ${destination.id}`);
                return true;
            } else {
                console.error("Invalid nodes for connection");
            }
        } else {
            console.error("Source or destination node is undefined");
        }
        return false;
    } else if (destination instanceof AudioDestinationGraphNode) {
        console.log("Connecting to AudioDestinationNode:", source?.id, destination.id);
        source?.node.connect(destination.node.context.destination);
        return true;
    } else if (destination instanceof AudioParam) {
        console.log("Connecting AudioParam:", source?.id, destination);
        source?.node.connect(destination);
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

export interface NodeConnectState {
    source?: AudioGraphNode;
    destination?: AudioGraphNode | AudioDestinationNode | AudioParam;
}
