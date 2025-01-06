import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AudioGraphView, NewConnectionDetail } from "./components/audio-graph-view";
import { AudioGraph, NodeType } from "./app/audio-graph";
import { BiquadFilterNodeView } from "./components/biquad-filter-node-view";
import { GainNodeView } from "./components/gain-node-view";
import { OscillatorNodeView } from "./components/oscillator-node-view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel-view";
import "./components/audio-graph-view";
import "./components/side-panel-view";

@customElement("app-view")
export class AppView extends LitElement {
	static styles = [appStyles];

	@state()
	private accessor _audioGraph = new AudioGraph();

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

	private _debug() {
		console.log(this._audioGraph);
	}

	handleAddConnection(e: Event) {
		const addConnection = (e as CustomEvent).detail.newConnection as NewConnectionDetail;
		this._audioGraph = this._audioGraph?.addConnection(addConnection.sourceNode, addConnection.destinationNode);
	}

	render() {
		return html` <div class="app">
			<div class="controls">
				<button @click="${() => this.handleAddNode("osc")}">Oscillator Node</button>
				<button @click="${() => this.handleAddNode("gain")}">Gain Node</button>
				<button @click="${() => this.handleAddNode("biquad")}">Biquad Filter Node</button>
				<button @click=${this._doot}>doot</button>
				<button @click=${this._debug}>debug</button>
			</div>
			<audio-graph-view class="graph" .audioGraph=${this._audioGraph}></audio-graph-view>
			<side-panel-view></side-panel-view>
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
