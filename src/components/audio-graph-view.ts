import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph, GraphNode } from "../app/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import { FrequencyChangeDetail, OscillatorTypeChangeDetail } from "./oscillator-node-view";
import { GainChangeDetail } from "./gain-node-view";
import {
	BiquadFilterDetuneChangeDetail,
	BiquadFilterFrequencyChangeDetail,
	BiquadFilterGainChangeDetail,
	BiquadFilterQChangeDetail,
	BiquadFilterTypeChangeDetail,
} from "./biquad-filter-node-view";
import "./biquad-filter-node-view";
import "./gain-node-view";
import "./oscillator-node-view";

export interface NewConnectionDetail {
	sourceNode: GraphNode;
	destinationNode: GraphNode;
}

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
	static styles = [audioGraphStyles];

	@property({ type: Object })
	audioGraph?: AudioGraph;

	@state()
	protected _sourceNode?: GraphNode;

	private handleNodeClick(e: CustomEvent) {
		if (this._sourceNode === undefined) {
			this._sourceNode = e.detail.node;
		} else if (this._sourceNode === e.detail.node) {
			this._sourceNode = undefined;
		} else if (this._sourceNode !== e.detail.node) {
			const newConnection: NewConnectionDetail = {
				sourceNode: this._sourceNode,
				destinationNode: e.detail.node as GraphNode,
			};
			this.dispatchEvent(
				new CustomEvent("add-connection", {
					detail: { newConnection },
					composed: true,
				})
			);
			this._sourceNode = undefined;
		}
	}

	private handleFrequencyChange(e: CustomEvent) {
		const frequencyChange = e.detail.frequencyChange as FrequencyChangeDetail;
		this.audioGraph?.graphNodes?.map((node) => {
			if (node === frequencyChange.node) {
				(node.audioNode as OscillatorNode).frequency.setValueAtTime(
					frequencyChange.frequency,
					this.audioGraph!.context.currentTime
				);
			}
		});
	}

	private handleOscillatorTypeChange(e: CustomEvent) {
		const typeChange = e.detail.typeChange as OscillatorTypeChangeDetail;
		this.audioGraph?.graphNodes?.map((node) => {
			if (node === typeChange.node) {
				(node.audioNode as OscillatorNode).type = typeChange.type;
			}
		});
	}

	private handleBiquadFilterTypeChange(e: CustomEvent) {
		const typeChange = e.detail.typeChange as BiquadFilterTypeChangeDetail;
		this.audioGraph?.graphNodes?.map((node) => {
			if (node === typeChange.node) {
				(node.audioNode as BiquadFilterNode).type = typeChange.type;
			}
		});
	}

	private handleGainChange(e: CustomEvent) {
		const gainChange = e.detail.gainChange as GainChangeDetail;
		this.audioGraph?.graphNodes?.map((node) => {
			if (node === gainChange.node) {
				(node.audioNode as GainNode).gain.exponentialRampToValueAtTime(
					gainChange.gain,
					this.audioGraph?.context.currentTime! + 0.1
				);
			}
		});
	}

	private handleBiquadFrequencyChange(e: CustomEvent) {
		console.log(e.detail);
		const frequencyChange = e.detail.frequencyChange as BiquadFilterFrequencyChangeDetail;
		this.audioGraph?.graphNodes.map((node) => {
			if (node === frequencyChange.node) {
				(node.audioNode as BiquadFilterNode).frequency.setValueAtTime(
					frequencyChange.frequency,
					this.audioGraph!.context.currentTime
				);
			}
		});
	}

	private handleBiquadDetuneChange(e: CustomEvent) {
		const detuneChange = e.detail.detuneChange as BiquadFilterDetuneChangeDetail;
		this.audioGraph?.graphNodes.map((node) => {
			if (node === detuneChange.node) {
				(node.audioNode as BiquadFilterNode).detune.setValueAtTime(detuneChange.detune, this.audioGraph!.context.currentTime);
			}
		});
	}

	private handleBiquadQChange(e: CustomEvent) {
		const qChange = e.detail.qChange as BiquadFilterQChangeDetail;
		this.audioGraph?.graphNodes.map((node) => {
			if (node === qChange.node) {
				(node.audioNode as BiquadFilterNode).Q.setValueAtTime(qChange.q, this.audioGraph!.context.currentTime);
			}
		});
	}

	private handleBiquadGainChange(e: CustomEvent) {
		const gainChange = e.detail.gainChange as BiquadFilterGainChangeDetail;
		this.audioGraph?.graphNodes.map((node) => {
			if (node === gainChange.node) {
				(node.audioNode as BiquadFilterNode).gain.setValueAtTime(gainChange.gain, this.audioGraph!.context.currentTime);
			}
		});
	}

	private renderNodeView(node: GraphNode): TemplateResult {
		switch (node.type) {
			case `gain`:
				return html`<gain-node-view
					.node=${node}
					.destination=${this.audioGraph?.context.destination}
					?isSourceNode=${this._sourceNode === node}
					@node-clicked=${this.handleNodeClick}
					@gain-changed=${this.handleGainChange}
				></gain-node-view>`;
			case `osc`:
				return html`<oscillator-node-view
					.node=${node}
					?isSourceNode=${this._sourceNode === node}
					@node-clicked=${this.handleNodeClick}
					@frequency-change=${this.handleFrequencyChange}
					@type-change=${this.handleOscillatorTypeChange}
				></oscillator-node-view>`;
			case `biquad`:
				return html`<biquad-filter-node-view
					.node=${node}
					.destination=${this.audioGraph?.context.destination}
					?isSourceNode=${this._sourceNode === node}
					@node-clicked=${this.handleNodeClick}
					@type-change=${this.handleBiquadFilterTypeChange}
					@biquad-filter-frequency-change=${this.handleBiquadFrequencyChange}
					@biquad-filter-detune-change=${this.handleBiquadDetuneChange}
					@biquad-filter-q-change=${this.handleBiquadQChange}
					@biquad-filter-gain-change=${this.handleBiquadGainChange}
				></biquad-filter-node-view>`;
		}
	}

	render() {
		return html` ${this.audioGraph?.graphNodes.map((node) => this.renderNodeView(node))} `;
	}
}
