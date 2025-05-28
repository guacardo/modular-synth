import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BiquadFilterNodeView } from "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/audio-nodes/processing/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { AUDIO_CONTEXT, AudioGraphNode, AudioNodeType } from "./app/util";
import "./components/audio-graph-view/audio-graph-view.view";
import "./components/audio-nodes/processing/biquad-filter/biquad-filter-node.view";
import "./components/audio-nodes/processing/gain-node/gain-node.view";
import "./components/audio-nodes/source/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import "./components/audio-nodes/destination/audio-destination-node.view";
import { AudioGraphView } from "./components/audio-graph-view/audio-graph-view.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() AUDIO_GRAPH: AudioGraphNode[] = [];
    @state() currRow: number = 0;
    @state() currCol: number = 0;

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType) => {
        this.AUDIO_GRAPH = [
            ...this.AUDIO_GRAPH,
            new AudioGraphNode(type, [++this.currRow, this.currCol], (this.AUDIO_GRAPH.length + 1).toString()),
        ];
    };

    readonly handleConnectToContext = () => {
        console.log("Connecting graph to context");
        if (this.AUDIO_GRAPH.length > 0) {
            this.AUDIO_GRAPH[this.AUDIO_GRAPH.length - 1].node.connect(AUDIO_CONTEXT.destination);
        }
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) => (n.id === node.id ? { ...n, ...node } : n));
    };

    private log() {
        console.log("Current Audio Graph:", this.AUDIO_GRAPH);
        console.log("Current Row:", this.currRow, "Current Column:", this.currCol);
        console.log("Audio Context:", AUDIO_CONTEXT);
    }

    render() {
        return html` <div class="app">
            <button @click=${this.log}>Log State</button>
            <audio-graph-view
                .audioGraph=${this.AUDIO_GRAPH}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .connectToContext=${this.handleConnectToContext}
            ></audio-graph-view>
            <side-panel-view
                orientation="right"
                .audioGraph=${this.AUDIO_GRAPH}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .connectToContext=${this.handleConnectToContext}
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
    }
}
