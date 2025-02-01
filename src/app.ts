import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView } from "./components/audio-graph/audio-graph.view";
import { AudioGraph } from "./app/audio-graph";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import "./components/audio-graph/audio-graph.view";
import "./components/side-panel/side-panel.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    private accessor _audioGraph = new AudioGraph();

    private handleAddNode = (node: AudioNode) => {
        this._audioGraph = this._audioGraph.addNode(node);
    };

    private handleUpdateNode = (node: AudioNode, properties: Partial<Record<keyof AudioNode, number | string | [number, number]>>) => {
        const updateAudioNode = this._audioGraph.updateAudioNode(node, properties);
        console.log("node", updateAudioNode);
        // const updatedAudioGraph = this._audioGraph.setAudioNodes(updateAudioNode);
        // console.log("graph", this._audioGraph);
        // this._audioGraph = updatedAudioGraph;
    };

    render() {
        return html` <div class="app">
            <div class="controls">
                <button @click="${() => this.handleAddNode(new OscillatorNode(this._audioGraph.context))}">Oscillator Node</button>
                <button @click="${() => this.handleAddNode(new GainNode(this._audioGraph.context))}">Gain Node</button>
                <button @click="${() => this.handleAddNode(new BiquadFilterNode(this._audioGraph.context))}">Biquad Filter Node</button>
            </div>
            <audio-graph-view class="graph" .audioGraph=${this._audioGraph}></audio-graph-view>
            <side-panel-view
                .audioGraph=${this._audioGraph}
                .handleUpdateNode=${this.handleUpdateNode}
                orientation="left"
            ></side-panel-view>
            <side-panel-view
                .audioGraph=${this._audioGraph}
                .handleUpdateNode=${this.handleUpdateNode}
                orientation="right"
            ></side-panel-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "gain-node-view": GainNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "side-panel-view": SidePanelView;
    }
}
