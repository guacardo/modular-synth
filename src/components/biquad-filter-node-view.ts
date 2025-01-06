import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { GraphNode } from "../app/audio-graph";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";

export interface BiquadFilterTypeChangeDetail {
	node: GraphNode | undefined;
	type: BiquadFilterType;
}

export interface BiquadFilterFrequencyChangeDetail {
	node: GraphNode | undefined;
	frequency: number;
}

export interface BiquadFilterDetuneChangeDetail {
	node: GraphNode | undefined;
	detune: number;
}

export interface BiquadFilterQChangeDetail {
	node: GraphNode | undefined;
	q: number;
}

export interface BiquadFilterGainChangeDetail {
	node: GraphNode | undefined;
	gain: number;
}

const settableBiquadFilterTypes: readonly BiquadFilterType[] = [
	"allpass",
	"bandpass",
	"highpass",
	"highshelf",
	"lowpass",
	"lowshelf",
	"notch",
	"peaking",
] as const;

@customElement("biquad-filter-node-view")
export class BiquadFilterNodeView extends LitElement {
	static styles = [graphNodeStyles];

	@property({ attribute: false }) node?: GraphNode;
	@property({ type: Object }) destination?: AudioDestinationNode;
	@state() connectedToContext: boolean = false;

	private _dispatchClick() {
		const node = this.node;
		// todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
		this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
	}

	private _dispatchTypeChange(e: Event) {
		const typeChange: BiquadFilterTypeChangeDetail = {
			node: this.node,
			type: (e.target as HTMLSelectElement).value as BiquadFilterType,
		};
		this.dispatchEvent(new CustomEvent("type-change", { detail: { typeChange }, composed: true }));
	}

	private _dispatchFrequencyChange(e: Event) {
		const frequencyChange: BiquadFilterFrequencyChangeDetail = {
			node: this.node,
			frequency: Number((e.target as HTMLInputElement).value),
		};
		this.dispatchEvent(new CustomEvent("biquad-filter-frequency-change", { detail: { frequencyChange }, composed: true }));
	}

	private _dispatchDetuneChange(e: Event) {
		const detuneChange: BiquadFilterDetuneChangeDetail = {
			node: this.node,
			detune: Number((e.target as HTMLInputElement).value),
		};
		this.dispatchEvent(new CustomEvent("biquad-filter-detune-change", { detail: { detuneChange }, composed: true }));
	}

	private _dispatchQChange(e: Event) {
		const qChange: BiquadFilterQChangeDetail = {
			node: this.node,
			q: Number((e.target as HTMLInputElement).value),
		};
		this.dispatchEvent(new CustomEvent("biquad-filter-q-change", { detail: { qChange }, composed: true }));
	}

	private _dispatchGainChange(e: Event) {
		const gainChange: BiquadFilterGainChangeDetail = {
			node: this.node,
			gain: Number((e.target as HTMLInputElement).value),
		};
		this.dispatchEvent(new CustomEvent("biquad-filter-gain-change", { detail: { gainChange }, composed: true }));
	}

	private _connectContextHandler(e: Event) {
		e.stopPropagation();
		if (this.destination !== undefined) {
			this.node?.audioNode.connect(this.destination);
			this.connectedToContext = true;
		}
	}

	render() {
		return html`<div
			id=${ifDefined(this.node?.id)}
			class=${classMap({ node: true, connectedContext: this.connectedToContext })}
			@click=${this._dispatchClick}
		>
			<p>${this.node?.id}</p>
			<select @change=${this._dispatchTypeChange} @click=${(e: Event) => e.stopPropagation()}>
				${settableBiquadFilterTypes.map((type) => {
					return html`<option
						value=${type}
						?selected=${type === ((this.node?.audioNode as BiquadFilterNode).type as BiquadFilterType)}
					>
						${type}
					</option>`;
				})}
			</select>
			<label for="${`frequency_${this.node?.id}`}">Frequency:</label>
			<input
				id="${`frequency_${this.node?.id}`}"
				type="range"
				max="10000"
				@input=${this._dispatchFrequencyChange}
				draggable="true"
				@dragstart=${(e: DragEvent) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
			<label for="${`detune_${this.node?.id}`}">Detune:</label>
			<input
				id="${`detune_${this.node?.id}`}"
				type="range"
				@input=${this._dispatchDetuneChange}
				draggable="true"
				@dragstart=${(e: DragEvent) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
			<label for="${`q_${this.node?.id}`}">Q:</label>
			<input
				id="${`q_${this.node?.id}`}"
				type="range"
				@input=${this._dispatchQChange}
				draggable="true"
				@dragstart=${(e: DragEvent) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
			<label for="${`gain_${this.node?.id}`}">Gain:</label>
			<input
				id="${`gain_${this.node?.id}`}"
				type="range"
				@input=${this._dispatchGainChange}
				draggable="true"
				@dragstart=${(e: DragEvent) => {
					e.stopPropagation();
					e.preventDefault();
				}}
			/>
			${this.connectedToContext
				? html`<p>connected</p>`
				: html`<button @click=${(e: Event) => this._connectContextHandler(e)}>connect</button>`}
		</div>`;
	}
}
