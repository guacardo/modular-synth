import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView, NewConnectionDetail } from "./components/audio-graph-view";
import { AudioGraph, NodeType } from "./app/audio-graph";
import { GainNodeView } from "./components/gain-node-view";
import { OscillatorNodeView } from "./components/oscillator-node-view";
import { appStyles } from "./styles/app-styles";
import { ConnectionView } from "./components/connection-view";
import { DomSpaceChangeDetail } from "./mixins/draggable";
import { DomSpace, NodeDomMap } from "./app/dom-mediator";
import "./components/audio-graph-view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    private accessor _audioGraph = new AudioGraph();

    @state()
    private _domSpace: NodeDomMap = new Map<string, DomSpace>();

    readonly handleAddNode = (type: NodeType) => {
        this._audioGraph = this._audioGraph.addNode(type);
    };

    private _doot() {
        this._audioGraph.graphNodes.map((node) => {
            if (node.type === `osc`) {
                (node.audioNode as OscillatorNode).start();
            }
        });
    }

    handleDomSpaceChange(e: Event) {
        const domSpaceChange = (e as CustomEvent).detail.domSpaceChange as DomSpaceChangeDetail;
        this._domSpace = new Map<string, DomSpace>(this._domSpace).set(domSpaceChange.id, domSpaceChange.space);
    }

    handleAddConnection(e: Event) {
        const addConnection = (e as CustomEvent).detail.newConnection as NewConnectionDetail;
        this._audioGraph = this._audioGraph?.addConnection(addConnection.sourceNode, addConnection.destinationNode);
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("dom-space-change", (e) => this.handleDomSpaceChange(e));
        this.addEventListener("add-connection", (e) => this.handleAddConnection(e));
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.removeEventListener("dom-space-change", (e) => this.handleDomSpaceChange(e));
        this.removeEventListener("add-connection", (e) => this.handleAddConnection(e));
    }

    render() {
        return html` <div class="app">
            <div class="controls">
                <button @click="${() => this.handleAddNode("osc")}">Oscillator Node</button>
                <button @click="${() => this.handleAddNode("gain")}">Gain Node</button>
                <button @click=${this._doot}>doot</button>
            </div>
            <audio-graph-view class="graph" .audioGraph=${this._audioGraph} .domSpace=${this._domSpace}></audio-graph-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
        "gain-node-view": GainNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "connection-view": ConnectionView;
    }
}
