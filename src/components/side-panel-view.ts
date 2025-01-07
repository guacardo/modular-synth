import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "../styles/side-panel-styles";
import { AudioGraph, GraphNode } from "../app/audio-graph";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
	static styles = [sidePanelStyles];

	@property({ type: Object })
	audioGraph?: AudioGraph;

	render() {
		return html` <div class="side-panel-container">
			<h1>Hello world side panel view</h1>
			<div class="audio-graph-node-container">${this.audioGraph?.graphNodes.map((node) => html`<div>${node.type}</div>`)}</div>
		</div>`;
	}

	private renderNodeView(node: GraphNode): TemplateResult {
		switch (node.type) {
			case `gain`:
				return html`<gain-node-view
					.node=${node}
					.destination=${this.audioGraph?.context.destination}
					@node-clicked=${this.handleNodeClick}
					@gain-changed=${this.handleGainChange}
				></gain-node-view>`;
			case `osc`:
				return html`<oscillator-node-view
					.node=${node}
					@node-clicked=${this.handleNodeClick}
					@frequency-change=${this.handleFrequencyChange}
					@type-change=${this.handleOscillatorTypeChange}
				></oscillator-node-view>`;
			case `biquad`:
				return html`<biquad-filter-node-view
					.node=${node}
					.destination=${this.audioGraph?.context.destination}
					@node-clicked=${this.handleNodeClick}
					@type-change=${this.handleBiquadFilterTypeChange}
					@biquad-filter-frequency-change=${this.handleBiquadFrequencyChange}
					@biquad-filter-detune-change=${this.handleBiquadDetuneChange}
					@biquad-filter-q-change=${this.handleBiquadQChange}
					@biquad-filter-gain-change=${this.handleBiquadGainChange}
				></biquad-filter-node-view>`;
		}
	}
}
