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
import { AudioGraphRepo } from "./app/audio-graph";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    private _audioGraphRepo = new AudioGraphRepo();
    @state() audioGraph: AudioGraphNode[] = [];
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
        this.audioGraph = this._audioGraphRepo.add(type, position);
    };

    // TODO: abstract connections into a repo class, integrate with AudioGraphRepo.
    readonly handleRemoveNode = (node: AudioGraphNode) => {
        // Disconnect all sources that were connected to this node as a destination
        this.CONNECTIONS.forEach(([src, dest]) => {
            if (dest === node.id) {
                const sourceNode = this.audioGraph.find((n) => n.id === src);
                if (sourceNode) {
                    sourceNode.node.disconnect(node.node);
                }
            }
        });

        // Remove all connections involving this node
        this.CONNECTIONS = this.CONNECTIONS.filter(([src, dest]) => src !== node.id && dest !== node.id);

        // Remove from graph
        this.audioGraph = this._audioGraphRepo.remove(node);
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.audioGraph = this._audioGraphRepo.update(node);
    };

    readonly handleSelectAudioGraphNode = (node: AudioGraphNode) => {
        this.audioGraph = this._audioGraphRepo.update({ ...node, isSelected: !node.isSelected });
    };

    // TODO: build ConnectionRepo. Integrate ConnectionRepo w/ AudioGraphRepo
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
        for (const node of this.audioGraph) {
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

        this._audioGraphRepo.clean();

        const newGraph: AudioGraphNode[] = (audioGraph as AudioGraphNodeSerialized[]).map((node) => {
            const NodeClass = nodeClassMap[node.type];
            if (!NodeClass) throw new Error(`Unknown node type: ${node.type}`);
            const newNode = new NodeClass(audioContext, node.position, node.id);
            newNode.isSelected = node.isSelected;
            return newNode;
        });
        this.audioGraph = newGraph;
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
        this.creationCounter = this.audioGraph.length + 1;
    };

    readonly clearAudioGraph = () => {
        this.audioGraph = this._audioGraphRepo.clear();
        this.CONNECTIONS = [];
    };

    render() {
        return html` <div class="app">
            <coaching-text-view .audioGraph=${this.audioGraph} .connections=${this.CONNECTIONS}></coaching-text-view>
            <canvas-overlay .connections=${this.CONNECTIONS}></canvas-overlay>
            <willys-rack-shack-view
                .audioGraph=${this.audioGraph}
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
                .audioGraph=${this.audioGraph}
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
