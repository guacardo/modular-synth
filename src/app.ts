import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView } from "./components/audio-graph-view";
import { AudioGraph, NodeType } from "./model/audio-graph";
import { GainNodeView } from "./components/gain-node-view";
import { OscillatorNodeView } from "./components/oscillator-node-view";
import "./components/audio-graph-view";

@customElement("app-view")
export class AppView extends LitElement {
    @state()
    private accessor _audioGraph = new AudioGraph([]);

    readonly handleAddNode = (type: NodeType) => {
        this._audioGraph = this._audioGraph.addNode(type);
    };

    private _doot() {
        (this._audioGraph.graphNodes[0].audioNode as OscillatorNode).connect(this._audioGraph.context.destination);
        (this._audioGraph.graphNodes[0].audioNode as OscillatorNode).start();
    }

    render() {
        return html` <div>
            <button @click="${() => this.handleAddNode("gain")}">Gain Node</button>
            <button @click="${() => this.handleAddNode("osc")}">Oscillator Node</button>
            <button @click=${this._doot}>doot</button>
            <audio-graph-view .audioGraph=${this._audioGraph}></audio-graph-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "gain-node-view": GainNodeView;
        "oscillator-node-view": OscillatorNodeView;
    }
}
