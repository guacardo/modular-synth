import { GainNodeView } from "./components/gainNode";
import { AudioGraphView } from "./templates/audio-graph-view";

// audio graph node types
export const nodeTypes = ["osc", "gain"] as const;
export type NodeType = (typeof nodeTypes)[number];

// hook it up
customElements.define("audio-graph-view", AudioGraphView);
customElements.define("gain-card-view", GainNodeView);

const audioGraphView = document.getElementById("audio-graph-view") as HTMLElement;

export class Node {
    key: string;
    type: NodeType;
    connections: string[];

    constructor(key: string, type: NodeType, connections: string[]) {
        this.key = key;
        this.type = type;
        this.connections = connections;
    }
}

export class OscillatorNode extends Node {
    frequency: number;

    constructor(node: OscillatorNode) {
        super(node.key, node.type, node.connections);
        this.frequency = node.frequency;
    }
}

export class GainNode extends Node {
    gain: number;

    constructor(node: GainNode) {
        super(node.key, node.type, node.connections);
        this.gain = node.gain;
    }
}

export class AudioGraph {
    nodes: Array<OscillatorNode | GainNode>;
    context: AudioContext;

    constructor(nodes: Array<OscillatorNode | GainNode>) {
        this.nodes = nodes;
        this.context = new AudioContext();
    }

    newNode(type: NodeType) {
        switch (type) {
            case "gain":
                this.nodes.push(new GainNode({ key: this.nodes.length.toString(), type: "gain", gain: 1, connections: [] }));
                break;
            case "osc":
                this.nodes.push(new OscillatorNode({ key: this.nodes.length.toString(), type: "osc", frequency: 2000, connections: [] }));
                break;
        }
        audioGraphView.setAttribute("nodes", JSON.stringify(this.nodes));
    }
}

const AUDIO_GRAPH = new AudioGraph([]);

class DomEvents {
    newGainNode() {
        AUDIO_GRAPH.newNode("gain");
    }

    newOscillatorNode() {
        AUDIO_GRAPH.newNode("osc");
    }
}

declare global {
    interface Window {
        DOM_EVENTS: DomEvents;
    }
}
window.DOM_EVENTS = new DomEvents();
