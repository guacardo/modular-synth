import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { AUDIO_CONTEXT, AudioGraphNode, AudioNodeType, AudioParamName, connectAudioNodes, KeyboardAudioEvent, NodeConnectState, Position } from "./app/util";
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
import "./components/coaching-text/coaching-text.view";
import "./components/keyboard-controller/keyboard-controller.view";
import "./components/local-storage/local-storage.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import "./views/willys-rack-shack.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() AUDIO_GRAPH: AudioGraphNode[] = [];
    @state() CONNECTIONS: Array<[string, string]> = [];
    @state() nodeConnectState: NodeConnectState = {
        source: undefined,
        destination: undefined,
    };

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType, position: Position) => {
        let newNode: AudioGraphNode;
        switch (type) {
            case "biquad-filter":
                newNode = new BiquadFilterGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
                break;
            case "gain":
                newNode = new GainGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
                break;
            case "oscillator":
                newNode = new OscillatorGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
                break;
            case "audio-destination":
                newNode = new AudioDestinationGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
                break;
            case "delay":
                newNode = new DelayGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
                break;
            case "stereo-panner":
                newNode = new StereoPannerGraphNode(AUDIO_CONTEXT, position, (this.AUDIO_GRAPH.length + 1).toString());
        }
        this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newNode];
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) => (n.id === node.id ? Object.assign(Object.create(Object.getPrototypeOf(n)), n, node) : n));
    };

    readonly handleUpdateNodeConnect = (node: AudioGraphNode | AudioDestinationGraphNode, param?: AudioParam, paramName?: AudioParamName) => {
        if (
            (node instanceof BiquadFilterGraphNode ||
                node instanceof GainGraphNode ||
                node instanceof OscillatorGraphNode ||
                node instanceof DelayGraphNode ||
                node instanceof StereoPannerGraphNode) &&
            this.nodeConnectState.source?.id === undefined
        ) {
            this.nodeConnectState = {
                source: node,
                destination: undefined,
            };
        } else if (
            (node instanceof BiquadFilterGraphNode ||
                node instanceof GainGraphNode ||
                node instanceof OscillatorGraphNode ||
                node instanceof DelayGraphNode ||
                node instanceof StereoPannerGraphNode) &&
            this.nodeConnectState.source?.id === node.id
        ) {
            this.nodeConnectState = {
                source: undefined,
                destination: undefined,
            };
        } else if (this.nodeConnectState.source?.id) {
            // connect the two nodes if valid
            if (
                connectAudioNodes({
                    source: this.nodeConnectState.source,
                    destination: param !== undefined ? param : node,
                })
            ) {
                // add the connection to the CONNECTIONS array
                if (param && paramName) {
                    this.CONNECTIONS = [...this.CONNECTIONS, [this.nodeConnectState.source.id, `${node.id}-${paramName}`]];
                } else {
                    this.CONNECTIONS = [...this.CONNECTIONS, [this.nodeConnectState.source.id, node.id]];
                }
            }

            // reset state
            this.nodeConnectState = {
                source: undefined,
                destination: undefined,
            };
        } else {
            console.warn("Cannot connect to node or param");
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

    render() {
        console.log("AppView render", this.AUDIO_GRAPH, this.CONNECTIONS);
        return html` <div class="app">
            <div class="non-desktop-overlay">
                <p>big boi 'puters only sry</p>
            </div>
            <coaching-text-view .audioGraph=${this.AUDIO_GRAPH} .connections=${this.CONNECTIONS}></coaching-text-view>
            <willys-rack-shack-view
                .audioGraph=${this.AUDIO_GRAPH}
                .connections=${this.CONNECTIONS}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.handleUpdateNodeConnect}
                .onSelectAudioGraphNode=${this.handleSelectAudioGraphNode}
            >
            </willys-rack-shack-view>
            <keyboard-controller .keyboardAudioEvents=${this.mergeEventMaps()}></keyboard-controller>
            <local-storage-view .audioGraph=${this.AUDIO_GRAPH} .connections=${this.CONNECTIONS}></local-storage-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "coaching-text-view": CoachingTextView;
        "delay-node-view": DelayGraphNode;
        "gain-node-view": GainNodeView;
        "local-storage-view": LocalStorageView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
        "stereo-panner-view": StereoPannerView;
        "keyboard-controller": KeyboardController;
        "willys-rack-shack-view": WillysRackShackView;
    }
}
