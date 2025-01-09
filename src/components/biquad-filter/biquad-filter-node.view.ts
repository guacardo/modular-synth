import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { GraphNode } from "../../app/audio-graph";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";

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

    // does the biquad filter connect to context?
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
            <select
                @change=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
            >
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
                @input=${(e: Event) => {
                    console.log(e);
                }}
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
                @input=${(e: Event) => {
                    console.log(e);
                }}
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
                @input=${(e: Event) => {
                    console.log(e);
                }}
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
                @input=${(e: Event) => {
                    console.log(e);
                }}
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
