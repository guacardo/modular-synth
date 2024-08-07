import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView } from "./components/audio-graph-view";

import "./components/audio-graph-view";
import { AudioGraph, NodeType } from "./nodes";

@customElement("app-view")
export class AppView extends LitElement {
    @state()
    private accessor _audioGraph = new AudioGraph([]);

    readonly handleAddNode = (type: NodeType) => {
        this._audioGraph = this._audioGraph.addNode(type);
    };

    render() {
        return html` <div>
            <button @click="${() => this.handleAddNode("gain")}">Gain Node</button>
            <button @click="${() => this.handleAddNode("osc")}">Oscillator Node</button>
            <audio-graph-view .graphNodes=${this._audioGraph.graphNodes}></audio-graph-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
    }
}
