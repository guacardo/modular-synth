import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
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

    @property({ attribute: false }) biquadFilterNode: BiquadFilterNode;
    @property({ type: Object }) destination: AudioDestinationNode;
    @state() connectedToContext: boolean = false;

    render() {
        return html`<div class=${classMap({ node: true, connectedContext: this.connectedToContext })}>
            <p>${typeof this.biquadFilterNode}</p>
            <select
                @change=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
            >
                ${settableBiquadFilterTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === this.biquadFilterNode.type}>${type}</option>`;
                })}
            </select>
            <label>Frequency:</label>
            <input
                type="range"
                max="10000"
                @input=${(e: Event) => {
                    console.log(e);
                }}
            />
            <label>Detune:</label>
            <input
                type="range"
                @input=${(e: Event) => {
                    console.log(e);
                }}
            />
            <label>Q:</label>
            <input
                type="range"
                @input=${(e: Event) => {
                    console.log(e);
                }}
            />
            <label>Gain:</label>
            <input
                type="range"
                @input=${(e: Event) => {
                    console.log(e);
                }}
            />
        </div>`;
    }
}
