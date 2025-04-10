import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { AudioGraphNode, AudioNodeType } from "./app/util";
import "./components/audio-graph-view/audio-graph-view.view";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import { AudioGraphView } from "./components/audio-graph-view/audio-graph-view.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() AUDIO_GRAPH: AudioGraphNode[] = [];
    @state() currRow: number = 0;
    @state() currCol: number = 0;

    audioContext = new AudioContext();

    connectedCallback(): void {
        super.connectedCallback();
    }

    readonly handleAddNode = (type: AudioNodeType) => {
        let nodeToConnect: AudioGraphNode | undefined;
        switch (type) {
            case "oscillator":
                const newOscillator = new AudioGraphNode(
                    (this.AUDIO_GRAPH.length + 1).toString(),
                    [++this.currRow, this.currCol],
                    this.audioContext.createOscillator()
                );
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newOscillator];
                break;
            case "gain":
                const newGain = new AudioGraphNode(
                    (this.AUDIO_GRAPH.length + 1).toString(),
                    [++this.currRow, this.currCol],
                    this.audioContext.createGain()
                );
                nodeToConnect = this.AUDIO_GRAPH.find((n) => n.position[0] === this.currRow - 1 && n.position[1] === this.currCol);
                nodeToConnect?.node.connect(newGain.node as GainNode);
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newGain];
                break;
            case "biquad-filter":
                const newBiquadFilter = new AudioGraphNode(
                    (this.AUDIO_GRAPH.length + 1).toString(),
                    [++this.currRow, this.currCol],
                    this.audioContext.createBiquadFilter()
                );
                nodeToConnect = this.AUDIO_GRAPH.find((n) => n.position[0] === this.currRow - 1 && n.position[1] === this.currCol);
                nodeToConnect?.node.connect(newBiquadFilter.node as BiquadFilterNode);
                this.AUDIO_GRAPH = [...this.AUDIO_GRAPH, newBiquadFilter];
                break;
        }
    };

    readonly handleConnectToContext = () => {
        console.log("Connecting graph to context");
        if (this.AUDIO_GRAPH.length > 0) {
            this.AUDIO_GRAPH[this.AUDIO_GRAPH.length - 1].node.connect(this.audioContext.destination);
        }
    };

    readonly handleUpdateNode = (node: AudioGraphNode) => {
        this.AUDIO_GRAPH = this.AUDIO_GRAPH.map((n) => (n.id === node.id ? { ...n, ...node } : n));
    };

    render() {
        return html` <div class="app">
            <audio-graph-view .audioGraph=${this.AUDIO_GRAPH} .addNode=${this.handleAddNode}></audio-graph-view>
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
