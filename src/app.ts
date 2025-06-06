import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BiquadFilterNodeView } from "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/audio-nodes/processing/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { AudioGraphNode, AudioNodeType, connectAudioNodes, NodeConnectState } from "./app/util";
import { AudioGraphView } from "./components/audio-graph-view/audio-graph-view.view";
import { KeyboardController } from "./components/keyboard-controller/keyboard-controller.view";
import "./components/audio-graph-view/audio-graph-view.view";
import "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import "./components/audio-nodes/processing/gain-node/gain-node.view";
import "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import "./components/keyboard-controller/keyboard-controller.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import "./components/audio-nodes/destination/audio-destination-node/audio-destination-node.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() AUDIO_GRAPH: AudioGraphNode[] = [];
    @state() selectedAudioGraphNodes: AudioGraphNode[] = [];
    @state() currRow: number = 0;
    @state() currCol: number = 0;
    @state() nodeConnectState: NodeConnectState = {
        source: undefined,
        destination: undefined,
    };

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType) => {
        this.AUDIO_GRAPH = [
            ...this.AUDIO_GRAPH,
            new AudioGraphNode(type, [++this.currRow, this.currCol], (this.AUDIO_GRAPH.length + 1).toString()),
        ];
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) =>
            n.id === node.id ? Object.assign(Object.create(Object.getPrototypeOf(n)), n, node) : n
        );
    };

    readonly handleUpdateNodeConnect = (node: AudioGraphNode | AudioDestinationNode | AudioParam) => {
        if (node instanceof AudioGraphNode && this.nodeConnectState.source?.id === undefined) {
            this.nodeConnectState = {
                source: node,
                destination: undefined,
            };
        } else if (node instanceof AudioGraphNode && this.nodeConnectState.source?.id === node.id) {
            this.nodeConnectState = {
                source: undefined,
                destination: undefined,
            };
        } else if (this.nodeConnectState.source?.id) {
            // connect the two nodes if valid
            connectAudioNodes({
                source: this.nodeConnectState.source,
                destination: node,
            });
            // reset state
            this.nodeConnectState = {
                source: undefined,
                destination: undefined,
            };
        } else {
            console.warn("Cannot connect to node or param");
        }
    };

    readonly handleSelectAudioGraphNode = (node: AudioGraphNode) => {
        if (this.selectedAudioGraphNodes.some((n) => n.id === node.id)) {
            this.selectedAudioGraphNodes = this.selectedAudioGraphNodes.filter((n) => n.id !== node.id);
        } else {
            this.selectedAudioGraphNodes = [...this.selectedAudioGraphNodes, node];
        }
        console.log("Selected nodes:", this.selectedAudioGraphNodes);
    };

    render() {
        return html` <div class="app">
            <div class="non-desktop-overlay"><p>big computers only sry</p></div>
            <audio-graph-view
                .audioGraph=${this.AUDIO_GRAPH}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.handleUpdateNodeConnect}
                .onSelectAudioGraphNode=${this.handleSelectAudioGraphNode}
            ></audio-graph-view>
            <keyboard-controller></keyboard-controller>
            <side-panel-view
                orientation="right"
                .audioGraph=${this.AUDIO_GRAPH}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.handleUpdateNodeConnect}
            ></side-panel-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "gain-node-view": GainNodeView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
        "keyboard-controller": KeyboardController;
    }
}
