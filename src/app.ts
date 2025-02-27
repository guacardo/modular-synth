import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphStore } from "./components/audio-graph/audio-graph.store";
import { AudioGraphView } from "./components/audio-graph/audio-graph.view";
import { AudioGridView } from "./components/audio-grid/audio-grid.view";
import { AudioNodeProperties, GridAudioNode, Position } from "./app/util";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { EmptyNodeView } from "./components/empty-node/empty-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import "./components/audio-graph/audio-graph.view";
import "./components/audio-grid/audio-grid.view";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/empty-node/empty-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state() private _audioGraph = new AudioGraphStore();

    private handleAddNode = (nodeConstructor: new (context: AudioContext) => GridAudioNode, position: Position) => {
        const node = this._audioGraph.addNode(nodeConstructor, position);
        this._audioGraph = Object.assign(Object.create(AudioGraphStore.prototype), {
            ...this._audioGraph,
            gridAudioNodes: [...this._audioGraph.gridAudioNodes, node],
        });
        console.log(this._audioGraph);
    };

    private handleUpdateNode = (node: GridAudioNode, properties: AudioNodeProperties) => {
        const gridNodeCopy: GridAudioNode = {
            id: node.id,
            position: node.position,
            node: this._audioGraph.updateAudioParamValue(node.node, properties) || node.node,
        };
        this._audioGraph = this._audioGraph.findOrAddNode(gridNodeCopy);
    };

    render() {
        return html` <div class="app">
            <audio-grid-view .gridAudioNodes=${this._audioGraph.gridAudioNodes} .handleAddNode=${this.handleAddNode}></audio-grid-view>
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
        "biquad-filter-node-view": BiquadFilterNodeView;
        "empty-node-view": EmptyNodeView;
        "gain-node-view": GainNodeView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
    }
}
