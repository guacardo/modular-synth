import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { AudioGraphNode, AudioNodeType } from "./app/util";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    AUDIO_GRAPH: AudioGraphNode[] = [];

    audioContext = new AudioContext();

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType) => {
        switch (type) {
            case "oscillator":
                const newOscillator = new AudioGraphNode(
                    (this.AUDIO_GRAPH.length + 1).toString(),
                    [0, 0],
                    this.audioContext.createOscillator()
                );
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newOscillator];
                break;
            case "gain":
                const newGain = new AudioGraphNode((this.AUDIO_GRAPH.length + 1).toString(), [0, 0], this.audioContext.createGain());
                this.AUDIO_GRAPH[this.AUDIO_GRAPH.length - 1].node?.connect(newGain.node as GainNode);
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newGain];
                break;
            case "biquad-filter":
                const newBiquadFilter = new AudioGraphNode(
                    (this.AUDIO_GRAPH.length + 1).toString(),
                    [0, 0],
                    this.audioContext.createBiquadFilter()
                );
                this.AUDIO_GRAPH[this.AUDIO_GRAPH.length - 1].node?.connect(newBiquadFilter.node as BiquadFilterNode);
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newBiquadFilter];
                break;
        }
    };

    readonly handleConnectToContext = () => {
        console.log("Connecting graph to context");
        if (this.AUDIO_GRAPH.length > 0) {
            this.AUDIO_GRAPH[this.AUDIO_GRAPH.length - 1].node?.connect(this.audioContext.destination);
        }
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) => (n.id === node.id ? { ...n, ...node } : n));
    };

    render() {
        return html` <div class="app">
            <button @click=${() => console.log(this.AUDIO_GRAPH)}>Log Audio Graph</button>
            <audio-graph-view .audioGraph=${this.AUDIO_GRAPH}></audio-graph-view>
            <side-panel-view
                orientation="left"
                .audioGraph=${this.AUDIO_GRAPH}
                .addNode=${this.handleAddNode}
                .updateNode=${this.handleUpdateNode}
                .connectToContext=${this.handleConnectToContext}
            ></side-panel-view>
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
        "biquad-filter-node-view": BiquadFilterNodeView;
        "gain-node-view": GainNodeView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
    }
}
