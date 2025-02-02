import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView } from "./components/audio-graph/audio-graph.view";
import { AudioGraph } from "./app/audio-graph";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import "./components/audio-graph/audio-graph.view";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";
import { AudioNodeWithId } from "./app/util";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    private accessor _audioGraph = new AudioGraph();

    private handleAddNode = (nodeConstructor: new (context: AudioContext) => AudioNodeWithId) => {
        this._audioGraph = this._audioGraph.addNode(nodeConstructor);
    };

    private handleUpdateNode = (node: AudioNode, properties: Partial<Record<keyof AudioNode, number | string | [number, number]>>) => {
        const nodeCopy = this._audioGraph.updateAudioParamValue(node, properties);
        this._audioGraph = this._audioGraph.findOrAddNode(nodeCopy);
    };

    render() {
        console.log(this._audioGraph.audioNodes);
        return html` <div class="app">
            <audio-graph-view
                class="graph"
                .audioGraph=${this._audioGraph}
                .handleAddNode=${this.handleAddNode}
                .handleUpdateNode=${this.handleUpdateNode}
            ></audio-graph-view>
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
        "new-node-view": NewNodeView;
    }
}
