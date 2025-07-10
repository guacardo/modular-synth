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

export interface Connectable {
    connectTo(destination: AudioNode | AudioParam): boolean;
    getOutputNode(): AudioNode;
    getInputNode(): AudioNode;
    canConnectTo(destination: Connectable): boolean;
    getAudioParams(): Map<string, AudioParam>;
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
// New Connection Functions using Connectable interface
// =====================

export function connectConnectableNodes(source: Connectable, destination: Connectable): boolean {
    if (source.canConnectTo(destination)) {
        return source.connectTo(destination.getInputNode());
    } else {
        console.error("Cannot connect nodes: incompatible connection");
        return false;
    }
}

export function connectToAudioParam(source: Connectable, destination: AudioParam): boolean {
    return source.connectTo(destination);
}

// New function to connect nodes using connection managers
export function connectNodesWithManager(
    sourceNode: AudioGraphNode, 
    destinationNode: AudioGraphNode, 
    sourceNodeType: AudioNodeType,
    destinationNodeType: AudioNodeType
): boolean {
    const sourceManager = ConnectionManagerFactory.create(sourceNode, sourceNodeType);
    const destinationManager = ConnectionManagerFactory.create(destinationNode, destinationNodeType);
    
    return connectConnectableNodes(sourceManager, destinationManager);
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
    if (isConnectableGraphNode(destination)) {
        if (source && destination) {
            // connecting DelayDenyComposeGraphNode to AudioNode
            if (source instanceof DelayDenyComposeGraphNode && destination.node instanceof AudioNode && destination.node.numberOfInputs > 0) {
                source.oscillator.connect(destination.node);
                return true;
                // connecting other general AudioGraphNode
            } else if (
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
        if (source instanceof DelayDenyComposeGraphNode) {
            source.gainNode.connect(destination.node.context.destination);
        } else {
            source?.node.connect(destination.node.context.destination);
        }
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
            console.log(node[propKey]);
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

// =====================
// Connection Manager Architecture
// =====================

// Serializable connection data for persistence
export interface ConnectionData {
    sourceNodeId: string;
    destinationNodeId: string;
    destinationParam?: string; // for AudioParam connections
}

// Serializable node data for persistence
export interface SerializableAudioGraphNode {
    id: string;
    position: Position;
    isSelected: boolean;
    nodeType: AudioNodeType;
    nodeProperties: AudioNodeProperties;
    customData?: Record<string, any>; // Node-specific data (like dutyCycle)
}

// Base connection manager class
export abstract class NodeConnectionManager implements Connectable {
    constructor(protected graphNode: AudioGraphNode) {}
    
    abstract connectTo(destination: AudioNode | AudioParam): boolean;
    abstract getOutputNode(): AudioNode;
    abstract getInputNode(): AudioNode;
    abstract canConnectTo(destination: Connectable): boolean;
    abstract getAudioParams(): Map<string, AudioParam>;
    
    // Get the node this manager is responsible for
    getGraphNode(): AudioGraphNode {
        return this.graphNode;
    }
}

// Connection manager factory
export class ConnectionManagerFactory {
    static create(graphNode: AudioGraphNode, nodeType: AudioNodeType): NodeConnectionManager {
        switch (nodeType) {
            case "oscillator":
                return new OscillatorConnectionManager(graphNode);
            case "gain":
                return new GainConnectionManager(graphNode);
            case "biquad-filter":
                return new BiquadFilterConnectionManager(graphNode);
            case "delay":
                return new DelayConnectionManager(graphNode);
            case "stereo-panner":
                return new StereoPannerConnectionManager(graphNode);
            case "audio-destination":
                return new AudioDestinationConnectionManager(graphNode);
            case "delay-deny-compose":
                return new DelayDenyComposeConnectionManager(graphNode);
            default:
                throw new Error(`Unknown node type: ${nodeType}`);
        }
    }
}

// Oscillator-specific connection manager
export class OscillatorConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean {
        try {
            const outputNode = this.getOutputNode();
            if (destination instanceof AudioParam) {
                outputNode.connect(destination);
                return true;
            } else if (destination instanceof AudioNode && destination.numberOfInputs > 0) {
                outputNode.connect(destination);
                return true;
            } else {
                console.error("Cannot connect to destination: invalid or no inputs");
                return false;
            }
        } catch (error) {
            console.error("Connection failed:", error);
            return false;
        }
    }

    getOutputNode(): AudioNode {
        // For oscillator nodes, we connect through the gainNode
        return (this.graphNode as OscillatorGraphNode).gainNode;
    }

    getInputNode(): AudioNode {
        // Oscillator nodes don't have inputs, but return gainNode for consistency
        return (this.graphNode as OscillatorGraphNode).gainNode;
    }

    canConnectTo(destination: Connectable): boolean {
        const destInputNode = destination.getInputNode();
        return destInputNode.numberOfInputs > 0;
    }

    getAudioParams(): Map<string, AudioParam> {
        const params = new Map<string, AudioParam>();
        const oscillatorNode = this.graphNode as OscillatorGraphNode;
        params.set("frequency", oscillatorNode.node.frequency);
        params.set("detune", oscillatorNode.node.detune);
        params.set("gain", oscillatorNode.gainNode.gain);
        return params;
    }
}

// Placeholder connection managers for other node types
export class GainConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean {
        try {
            const outputNode = this.getOutputNode();
            if (destination instanceof AudioParam) {
                outputNode.connect(destination);
                return true;
            } else if (destination instanceof AudioNode && destination.numberOfInputs > 0) {
                outputNode.connect(destination);
                return true;
            } else {
                console.error("Cannot connect to destination: invalid or no inputs");
                return false;
            }
        } catch (error) {
            console.error("Connection failed:", error);
            return false;
        }
    }

    getOutputNode(): AudioNode {
        // For gain nodes, the gain node itself is both input and output
        return this.graphNode.node;
    }

    getInputNode(): AudioNode {
        // For gain nodes, the gain node itself is both input and output
        return this.graphNode.node;
    }

    canConnectTo(destination: Connectable): boolean {
        const destInputNode = destination.getInputNode();
        return destInputNode.numberOfInputs > 0;
    }

    getAudioParams(): Map<string, AudioParam> {
        const params = new Map<string, AudioParam>();
        const gainNode = this.graphNode.node as GainNode;
        params.set("gain", gainNode.gain);
        return params;
    }
}

export class BiquadFilterConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean { throw new Error("Not implemented yet"); }
    getOutputNode(): AudioNode { throw new Error("Not implemented yet"); }
    getInputNode(): AudioNode { throw new Error("Not implemented yet"); }
    canConnectTo(destination: Connectable): boolean { throw new Error("Not implemented yet"); }
    getAudioParams(): Map<string, AudioParam> { throw new Error("Not implemented yet"); }
}

export class DelayConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean { throw new Error("Not implemented yet"); }
    getOutputNode(): AudioNode { throw new Error("Not implemented yet"); }
    getInputNode(): AudioNode { throw new Error("Not implemented yet"); }
    canConnectTo(destination: Connectable): boolean { throw new Error("Not implemented yet"); }
    getAudioParams(): Map<string, AudioParam> { throw new Error("Not implemented yet"); }
}

export class StereoPannerConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean { throw new Error("Not implemented yet"); }
    getOutputNode(): AudioNode { throw new Error("Not implemented yet"); }
    getInputNode(): AudioNode { throw new Error("Not implemented yet"); }
    canConnectTo(destination: Connectable): boolean { throw new Error("Not implemented yet"); }
    getAudioParams(): Map<string, AudioParam> { throw new Error("Not implemented yet"); }
}

export class AudioDestinationConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean { throw new Error("Not implemented yet"); }
    getOutputNode(): AudioNode { throw new Error("Not implemented yet"); }
    getInputNode(): AudioNode { throw new Error("Not implemented yet"); }
    canConnectTo(destination: Connectable): boolean { throw new Error("Not implemented yet"); }
    getAudioParams(): Map<string, AudioParam> { throw new Error("Not implemented yet"); }
}

export class DelayDenyComposeConnectionManager extends NodeConnectionManager {
    connectTo(destination: AudioNode | AudioParam): boolean { throw new Error("Not implemented yet"); }
    getOutputNode(): AudioNode { throw new Error("Not implemented yet"); }
    getInputNode(): AudioNode { throw new Error("Not implemented yet"); }
    canConnectTo(destination: Connectable): boolean { throw new Error("Not implemented yet"); }
    getAudioParams(): Map<string, AudioParam> { throw new Error("Not implemented yet"); }
}

// =====================
// Connectable Interface & Functions
// =====================

// Test function to demonstrate the new connection system
export function testConnectionManagers(): void {
    console.log("Testing Connection Managers...");
    
    // Create test nodes
    const carrierOsc = new OscillatorGraphNode(AUDIO_CONTEXT, [100, 100], "carrier-osc");
    const modulatorOsc = new OscillatorGraphNode(AUDIO_CONTEXT, [50, 50], "modulator-osc");
    const gainNode = new GainGraphNode(AUDIO_CONTEXT, [200, 200], "test-gain");
    
    // Create connection managers
    const carrierManager = new OscillatorConnectionManager(carrierOsc);
    const modulatorManager = new OscillatorConnectionManager(modulatorOsc);
    const gainManager = new GainConnectionManager(gainNode);
    
    // Test 1: Regular audio connection (carrier oscillator -> gain input)
    console.log("=== Test 1: Audio Connection ===");
    const audioConnected = connectConnectableNodes(carrierManager, gainManager);
    console.log("Carrier -> Gain audio connection:", audioConnected);
    
    // Test 2: Parameter modulation using helper function
    console.log("=== Test 2: Parameter Modulation ===");
    
    // AM: Modulator oscillator -> gain parameter (amplitude modulation)
    const amConnected = connectToParameter(modulatorOsc, "oscillator", gainNode, "gain", "gain");
    console.log("AM connection (modulator -> gain.gain):", amConnected);
    
    // FM: Modulator oscillator -> carrier frequency parameter (frequency modulation)  
    const fmConnected = connectToParameter(modulatorOsc, "oscillator", carrierOsc, "oscillator", "frequency");
    console.log("FM connection (modulator -> carrier.frequency):", fmConnected);
    
    // Test 3: Show available parameters
    console.log("=== Test 3: Available Parameters ===");
    const carrierParams = carrierManager.getAudioParams();
    const gainParams = gainManager.getAudioParams();
    
    console.log("Carrier oscillator params:", Array.from(carrierParams.keys()));
    console.log("Gain node params:", Array.from(gainParams.keys()));
    
    console.log("=== Connection Manager Test Complete! ===");
    console.log("🎵 You now have:");
    console.log("   - Carrier oscillator connected to gain (audio signal)");
    console.log("   - Modulator oscillator modulating gain amount (AM)");
    console.log("   - Modulator oscillator modulating carrier frequency (FM)");
}

// Helper function to connect to a specific parameter
export function connectToParameter(
    sourceNode: AudioGraphNode,
    sourceNodeType: AudioNodeType,
    destinationNode: AudioGraphNode,
    destinationNodeType: AudioNodeType,
    parameterName: string
): boolean {
    const sourceManager = ConnectionManagerFactory.create(sourceNode, sourceNodeType);
    const destinationManager = ConnectionManagerFactory.create(destinationNode, destinationNodeType);
    
    const params = destinationManager.getAudioParams();
    const targetParam = params.get(parameterName);
    
    if (!targetParam) {
        console.error(`Parameter '${parameterName}' not found on destination node`);
        return false;
    }
    
    return sourceManager.connectTo(targetParam);
}

// =====================
// Utility Functions
// =====================
