import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraph } from "./app/audio-graph";
import { AudioGraphView } from "./components/audio-graph/audio-graph.view";
import { AudioGridView } from "./components/audio-grid/audio-grid.view";
import { AudioNodeProperties, AudioNodeWithId } from "./app/util";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import "./components/audio-graph/audio-graph.view";
import "./components/audio-grid/audio-grid.view";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    private accessor _audioGraph = new AudioGraph();

    private handleAddNode = (nodeConstructor: new (context: AudioContext) => AudioNodeWithId) => {
        this._audioGraph = this._audioGraph.addNode(nodeConstructor);
    };

    private handleUpdateNode = (node: AudioNodeWithId, properties: AudioNodeProperties) => {
        const nodeWithIdCopy: AudioNodeWithId = {
            id: node.id,
            node: this._audioGraph.updateAudioParamValue(node.node, properties) || node.node,
        };
        this._audioGraph = this._audioGraph.findOrAddNode(nodeWithIdCopy);
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
            <audio-grid-view .audioGraphNodes=${this._audioGraph.audioNodes}></audio-grid-view>
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
        "audio-grid-view": AudioGridView;
        "gain-node-view": GainNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "side-panel-view": SidePanelView;
        "new-node-view": NewNodeView;
    }
}
