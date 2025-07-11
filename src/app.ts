import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { AudioGraphNode, AudioNodeType, AudioParamName, KeyboardAudioEvent, NodeConnectState, Position } from "./app/util";
import { AudioDestinationGraphNode } from "./components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "./components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { BiquadFilterNodeView } from "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import { CoachingTextView } from "./components/coaching-text/coaching-text.view";
import { DelayGraphNode } from "./components/audio-nodes/processing/delay/delay-graph-node";
import { GainGraphNode } from "./components/audio-nodes/processing/gain-node/gain-graph-node";
import { GainNodeView } from "./components/audio-nodes/processing/gain-node/gain-node.view";
import { KeyboardController } from "./components/keyboard-controller/keyboard-controller.view";
import { LocalStorageView } from "./components/local-storage/local-storage.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { OscillatorGraphNode } from "./components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { OscillatorNodeView } from "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { StereoPannerGraphNode } from "./components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { StereoPannerView } from "./components/audio-nodes/processing/stereo-panner/stereo-panner.view";
import { WillysRackShackView } from "./views/willys-rack-shack.view";
import { appStyles } from "./styles/app-styles";
import { AudioGraphView } from "./components/audio-graph-view/audio-graph-view.view";

import "./components/audio-graph-view/audio-graph-view.view";
import "./components/audio-nodes/destination/audio-destination-node/audio-destination-node.view";
import "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import "./components/audio-nodes/processing/delay/delay-node.view";
import "./components/audio-nodes/processing/gain-node/gain-node.view";
import "./components/audio-nodes/processing/stereo-panner/stereo-panner.view";
import "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import "./components/canvas-overlay/canvas-overlay.view";
import "./components/coaching-text/coaching-text.view";
import "./components/input-output-jack/input-output-jack.view";
import "./components/keyboard-controller/keyboard-controller.view";
import "./components/local-storage/local-storage.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import "./components/audio-nodes/super/delay-deny-compose/delay-deny-compose.view";
import "./views/willys-rack-shack.view";
import { DelayDenyComposeGraphNode } from "./components/audio-nodes/super/delay-deny-compose/delay-deny-compose-node";
import { CanvasOverlay } from "./components/canvas-overlay/canvas-overlay.view";
import { InputOutputJackView } from "./components/input-output-jack/input-output-jack.view";
import { getAudioContext } from "./app/audio-context";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() AUDIO_GRAPH: AudioGraphNode[] = [];
    @state() CONNECTIONS: Array<[string, string]> = [];
    @state() nodeConnectState: NodeConnectState = {
        source: undefined,
        destination: undefined,
    };
    @state() creationCounter: number = 0;

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType, position: Position) => {
        const audioContext = getAudioContext();
        let newNode: AudioGraphNode;
        switch (type) {
            case "biquad-filter":
                newNode = new BiquadFilterGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "gain":
                newNode = new GainGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "oscillator":
                newNode = new OscillatorGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "audio-destination":
                newNode = new AudioDestinationGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "delay":
                newNode = new DelayGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "stereo-panner":
                newNode = new StereoPannerGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
            case "delay-deny-compose":
                newNode = new DelayDenyComposeGraphNode(audioContext, position, (this.creationCounter++).toString());
                break;
        }
        this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newNode];
    };

    readonly handleRemoveNode = (node: AudioGraphNode) => {
        try {
            node.node.disconnect();
        } catch {}
        if (node.node instanceof OscillatorNode) {
            try {
                node.node.stop();
            } catch {}
        }

        // Disconnect all sources that were connected to this node as a destination
        this.CONNECTIONS.forEach(([src, dest]) => {
            if (dest === node.id) {
                const sourceNode = this.AUDIO_GRAPH.find((n) => n.id === src);
                if (sourceNode) {
                    try {
                        sourceNode.node.disconnect(node.node);
                    } catch {}
                }
            }
        });

        // Remove all connections involving this node
        this.CONNECTIONS = this.CONNECTIONS.filter(([src, dest]) => src !== node.id && dest !== node.id);

        // Remove from graph
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.filter((n) => n.id !== node.id);
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) => (n.id === node.id ? Object.assign(Object.create(Object.getPrototypeOf(n)), n, node) : n));
    };

    readonly handleUpdateNodeConnect = (node: AudioGraphNode | AudioDestinationGraphNode, param?: AudioParam, paramName?: AudioParamName) => {
        if (this.nodeConnectState.source === undefined) {
            this.nodeConnectState = {
                source: node,
                destination: undefined,
            };
        } else if (this.nodeConnectState.source?.id === node.id) {
            this.nodeConnectState = {
                source: undefined,
                destination: undefined,
            };
        } else if (this.nodeConnectState.source !== undefined) {
            if (this.nodeConnectState.source?.connectTo?.(param !== undefined ? param : node)) {
                if (param && paramName) {
                    this.CONNECTIONS = [...this.CONNECTIONS, [this.nodeConnectState.source.id, `${node.id}-${paramName}`]];
                } else {
                    this.CONNECTIONS = [...this.CONNECTIONS, [this.nodeConnectState.source.id, node.id]];
                }
                this.nodeConnectState = {
                    source: undefined,
                    destination: undefined,
                };
            }
        }
    };

    mergeEventMaps(): Map<string, KeyboardAudioEvent[]> {
        const result = new Map<string, KeyboardAudioEvent[]>();
        for (const node of this.AUDIO_GRAPH) {
            if (node.isSelected) {
                const events = node.getKeyboardEvents?.(this.handleUpdateNode);
                if (events !== undefined) {
                    for (const [key, eventList] of events.entries()) {
                        if (result.has(key)) {
                            result.set(key, [...(result.get(key) ?? []), eventList]);
                        } else {
                            result.set(key, [eventList]);
                        }
                    }
                }
            }
        }

        return result;
    }

    readonly handleSelectAudioGraphNode = (node: AudioGraphNode) => {
        const updatedNode = { ...node, isSelected: !node.isSelected };
        this.handleUpdateNode(updatedNode);
    };

    private cleanAudioGraph = () => {
        this.AUDIO_GRAPH.forEach((node) => {
            try {
                node.node.disconnect();
            } catch (e) {
                // Already disconnected or not connectable
            }
            // Stop oscillators to prevent lingering sound
            if (node.node instanceof OscillatorNode) {
                try {
                    node.node.stop();
                } catch (e) {
                    // Already stopped
                }
            }
        });
    };

    // TODO: clean up/split apart..multiple responsibilities here.
    readonly handleLoadAudioGraph = (audioGraph: AudioGraphNode[], connections: Array<[string, string]>) => {
        const audioContext = getAudioContext();
        type AudioGraphNodeSerialized = AudioGraphNode & { type: AudioNodeType };
        const nodeClassMap: Record<AudioNodeType, any> = {
            oscillator: OscillatorGraphNode,
            gain: GainGraphNode,
            "biquad-filter": BiquadFilterGraphNode,
            "audio-destination": AudioDestinationGraphNode,
            delay: DelayGraphNode,
            "stereo-panner": StereoPannerGraphNode,
            "delay-deny-compose": DelayDenyComposeGraphNode,
        };

        // Cleanup: disconnect and stop all nodes in the current audio graph
        this.cleanAudioGraph();

        const newGraph: AudioGraphNode[] = (audioGraph as AudioGraphNodeSerialized[]).map((node) => {
            const NodeClass = nodeClassMap[node.type];
            if (!NodeClass) throw new Error(`Unknown node type: ${node.type}`);
            const newNode = new NodeClass(audioContext, node.position, node.id);
            newNode.isSelected = node.isSelected;
            return newNode;
        });
        this.AUDIO_GRAPH = newGraph;
        // Reconnect audio nodes in the Web Audio graph
        connections.forEach(([sourceId, destinationId]) => {
            const source = newGraph.find((node) => node.id === sourceId);
            const destination = newGraph.find((node) => node.id === destinationId);
            if (source && destination) {
                source.connectTo?.(destination);
            } else {
                // todo: connect to AudioParam, not just AudioNode
                console.log("could not find connection", sourceId, destinationId);
            }
        });
        this.CONNECTIONS = connections;
        this.creationCounter = this.AUDIO_GRAPH.length + 1;
    };

    readonly clearAudioGraph = () => {
        this.cleanAudioGraph();
        this.AUDIO_GRAPH = [];
        this.CONNECTIONS = [];
    };

    render() {
        return html` <div class="app">
            <coaching-text-view .audioGraph=${this.AUDIO_GRAPH} .connections=${this.CONNECTIONS}></coaching-text-view>
            <canvas-overlay .connections=${this.CONNECTIONS}></canvas-overlay>
            <willys-rack-shack-view
                .audioGraph=${this.AUDIO_GRAPH}
                .connections=${this.CONNECTIONS}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .removeNode=${this.handleRemoveNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.handleUpdateNodeConnect}
                .onSelectAudioGraphNode=${this.handleSelectAudioGraphNode}
            >
            </willys-rack-shack-view>
            <keyboard-controller .keyboardAudioEvents=${this.mergeEventMaps()}></keyboard-controller>
            <local-storage-view
                .audioGraph=${this.AUDIO_GRAPH}
                .connections=${this.CONNECTIONS}
                .loadAudioGraph=${this.handleLoadAudioGraph}
                .clearAudioGraph=${this.clearAudioGraph}
            ></local-storage-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "canvas-overlay": CanvasOverlay;
        "coaching-text-view": CoachingTextView;
        "delay-node-view": DelayGraphNode;
        "gain-node-view": GainNodeView;
        "input-output-jack-view": InputOutputJackView;
        "local-storage-view": LocalStorageView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
        "stereo-panner-view": StereoPannerView;
        "keyboard-controller": KeyboardController;
        "willys-rack-shack-view": WillysRackShackView;
    }
}
