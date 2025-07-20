import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { AudioGraphNode, AudioNodeType, ConnectionComponents, KeyboardAudioEvent, Position } from "./app/util";
import { getAudioContext } from "./app/audio-context";
import { AudioGraphRepo } from "./app/audio-graph";
import { ConnectionRepo } from "./app/connections";
import { appStyles } from "./styles/app-styles";

// Component imports
import {
    AudioDestinationGraphNode,
    AudioGraphView,
    BiquadFilterGraphNode,
    BiquadFilterNodeView,
    CanvasOverlay,
    CoachingTextView,
    DelayDenyComposeGraphNode,
    DelayGraphNode,
    GainGraphNode,
    GainNodeView,
    InputOutputJackView,
    KeyboardController,
    LocalStorageView,
    NewNodeView,
    OscillatorGraphNode,
    OscillatorNodeView,
    RangeSliderView,
    SidePanelView,
    StereoPannerGraphNode,
    StereoPannerView,
} from "./components";
import { WillysRackShackView } from "./views";

// Component registration imports
import "./components/audio-graph-view";
import "./components/audio-nodes/destination";
import "./components/audio-nodes/processing/biquad-filter";
import "./components/audio-nodes/processing/delay";
import "./components/audio-nodes/processing/gain-node";
import "./components/audio-nodes/processing/stereo-panner";
import "./components/audio-nodes/source/oscillator-node";
import "./components/audio-nodes/super/delay-deny-compose";
import "./components/canvas-overlay";
import "./components/coaching-text";
import "./components/input-output-jack";
import "./components/keyboard-controller";
import "./components/local-storage";
import "./components/new-node";
import "./components/range-slider";
import "./components/side-panel";
import "./views";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    private _audioGraphRepo = new AudioGraphRepo();
    private _connectionRepo = new ConnectionRepo();
    private _connectionUnsubscribe?: () => void;

    @state() audioGraph: AudioGraphNode[] = this._audioGraphRepo.getAll();
    @state() connections: Array<[ConnectionComponents, ConnectionComponents]> = this._connectionRepo.getAll();
    @state() pendingConnectionState = this._connectionRepo.getPendingConnectionState();
    @state() creationCounter: number = 0;

    connectedCallback(): void {
        super.connectedCallback();

        this._connectionUnsubscribe = this._connectionRepo.onConnectionEvent((event) => {
            if (event.type === "connection-ready") {
                this.createConnections(event.connection);
            }
        });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this._connectionUnsubscribe?.();
    }

    private createConnections(connection: [ConnectionComponents, ConnectionComponents]) {
        this._audioGraphRepo.connect(connection);
        this.connections = this._connectionRepo.add(connection);
    }

    readonly handleAddNode = (type: AudioNodeType, position: Position) => {
        this.audioGraph = this._audioGraphRepo.add(type, position);
    };

    readonly handleRemoveNode = (node: AudioGraphNode) => {
        this.audioGraph = this._audioGraphRepo.remove(node);
        this.connections = this._connectionRepo.removeAllById(node.id);
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.audioGraph = this._audioGraphRepo.update(node);
    };

    readonly handleUpdateNodeConnect = (connection: ConnectionComponents) => {
        this.pendingConnectionState = this._connectionRepo.updatePendingConnectionState(connection);
    };

    readonly clearAudioGraph = () => {
        this.audioGraph = this._audioGraphRepo.clear();
        this.connections = this._connectionRepo.clear();
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
    readonly handleLoadAudioGraph = (audioGraph: AudioGraphNode[], connections: Array<[ConnectionComponents, ConnectionComponents]>) => {
        const audioContext = getAudioContext();
        type AudioGraphNodeSerialized = AudioGraphNode & { type: AudioNodeType };
        const nodeClassMap: Record<AudioNodeType, any> = {
            audioDestination: AudioDestinationGraphNode,
            biquadFilter: BiquadFilterGraphNode,
            delay: DelayGraphNode,
            delayDenyCompose: DelayDenyComposeGraphNode,
            gain: GainGraphNode,
            oscillator: OscillatorGraphNode,
            stereoPanner: StereoPannerGraphNode,
        };

        this._audioGraphRepo.clean();

        const newGraph: AudioGraphNode[] = (audioGraph as AudioGraphNodeSerialized[]).map((node) => {
            const NodeClass = nodeClassMap[node.type];
            if (!NodeClass) throw new Error(`Unknown node type: ${node.type}`);
            const newNode = new NodeClass(audioContext, node.position, node.id);
            return newNode;
        });
        this.audioGraph = this._audioGraphRepo.setAll(newGraph);
        connections.forEach((connection) => {
            this.createConnections(connection);
        });
        this.creationCounter = this.audioGraph.length + 1;
        console.log("Audio graph loaded", this.audioGraph, this.connections);
    };

    render() {
        return html` <div class="app">
            <coaching-text-view .audioGraph=${this.audioGraph} .connections=${this.connections}></coaching-text-view>
            <willys-rack-shack-view
                .audioGraph=${this.audioGraph}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .removeNode=${this.handleRemoveNode}
                .updatePendingConnectionState=${this.handleUpdateNodeConnect}
            >
            </willys-rack-shack-view>
            <p>${this.pendingConnectionState}</p>
            ${this.connections.map((connection) => {
                return html`<p>Connection: ${connection[0]} -> ${connection[1]}</p>`;
            })}
            <keyboard-controller .keyboardAudioEvents=${this.mergeEventMaps()}></keyboard-controller>
            <local-storage-view
                .audioGraph=${this.audioGraph}
                .connections=${this.connections}
                .loadAudioGraph=${this.handleLoadAudioGraph}
                .clearAudioGraph=${this.clearAudioGraph}
            ></local-storage-view>
            <canvas-overlay .connections=${this.connections}></canvas-overlay>
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
        "range-slider-view": RangeSliderView;
        "side-panel-view": SidePanelView;
        "stereo-panner-view": StereoPannerView;
        "keyboard-controller": KeyboardController;
        "willys-rack-shack-view": WillysRackShackView;
    }
}
