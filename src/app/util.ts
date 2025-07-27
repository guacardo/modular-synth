import { getAudioContext } from "./audio-context";

export type SafeExtract<T, U extends T> = U;
export type Position = [number, number];
export type AudioNodeProperties = Partial<
    Record<
        keyof AudioNode | keyof OscillatorNode | keyof GainNode | keyof BiquadFilterNode | keyof DelayNode | keyof StereoPannerNode,
        number | [number, number] | OscillatorType
    >
>;
export type AudioNodeType = "oscillator" | "gain" | "biquadFilter" | "audioDestination" | "delay" | "stereoPanner" | "delayDenyCompose";
type AudioProcessorNode = SafeExtract<AudioNodeType, "biquadFilter" | "gain" | "delay" | "stereoPanner">;
type AudioSourceNode = SafeExtract<AudioNodeType, "oscillator">;
type AudioGraphDestinationNode = SafeExtract<AudioNodeType, "audioDestination">;
type AudioSuperNode = SafeExtract<AudioNodeType, "delayDenyCompose">;

export type AudioParamName = "gain" | "frequency" | "detune" | "Q" | "delayTime" | "pan";
export type IOLabel = "in" | "out" | "mod";
export type AudioGraphId = [number, AudioNodeType];
export type ConnectionComponents = [...AudioGraphId, IOLabel];

export const AUDIO_PROCESSOR_NODES: AudioProcessorNode[] = ["biquadFilter", "delay", "gain", "stereoPanner"] as const;
export const AUDIO_SOURCE_NODES: AudioSourceNode[] = ["oscillator"] as const;
export const AUDIO_DESTINATION_NODES: AudioGraphDestinationNode[] = ["audioDestination"] as const;
export const AUDIO_SUPER_NODES: AudioSuperNode[] = ["delayDenyCompose"] as const;

export interface KeyboardAudioEvent {
    keydown: () => void;
    keyup?: () => void;
}

export interface ImmutableRepository<T> {
    add: (...args: any[]) => T[];
    remove: (item: T) => T[];
    update: (item: T) => T[];
    findById(id: any): T | undefined;
    getAll: () => T[];
    clear: () => void;
}

export interface AudioGraphNodeState {
    position: Position;
    isSelected: boolean;
}

export interface AudioGraphNode {
    id: AudioGraphId;
    node: AudioNode;
    state: AudioGraphNodeState;
    type: AudioNodeType;
    connectOut: (target: AudioNode | AudioParam | undefined) => boolean;
    connectIn: (target: IOLabel) => AudioNode | AudioParam | undefined;
    updateState: (key: keyof AudioGraphNodeState, value: any) => AudioGraphNode;
    getKeyboardEvents?: (updateNode: (node: AudioGraphNode) => void) => Map<string, KeyboardAudioEvent>;
}

export function updateAudioParamValue<T extends AudioNode>(
    node: T,
    properties: Partial<{
        [K in keyof T]: T[K] extends AudioParam ? number | [number, number] : T[K];
    }>
): T {
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

export function assertNever(x: never): never {
    throw new Error("Unexpected value: " + x);
}

export function findDOMCoordinates(id: string): Position {
    // First try regular document search
    let element = document.getElementById(id);

    // If not found, search through Shadow DOM
    if (!element) {
        element = findElementInShadowDOM(document.body, id) as HTMLElement;
    }

    if (!element) {
        console.warn(`Element with id ${id} not found`);
        return [0, 0];
    }

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2 + window.scrollX;
    const centerY = rect.top + rect.height / 2 + window.scrollY;
    return [centerX, centerY];
}

function findElementInShadowDOM(root: Element, id: string): Element | null {
    // Check if current element has the id
    if (root.id === id) {
        return root;
    }

    // Check children
    for (const child of Array.from(root.children)) {
        if (child.id === id) {
            return child;
        }

        // If child has shadow root, search inside it
        if (child.shadowRoot) {
            const found = findElementInShadowDOM(child.shadowRoot as any, id);
            if (found) return found;
        }

        // Recursively search child's children
        const found = findElementInShadowDOM(child, id);
        if (found) return found;
    }

    return null;
}
