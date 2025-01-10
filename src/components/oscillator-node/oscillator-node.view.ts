import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";

// export higher up? types file?
const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ attribute: false }) oscillatorNode: OscillatorNode;

    render() {
        return html`<div class="node">
            <p>oscillator</p>
            <input
                type="range"
                min="0"
                max="2000"
                @input=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
                draggable="true"
                @dragstart=${(e: DragEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
            <select
                @change=${(e: Event) => {
                    console.log(e);
                }}
                @click=${(e: Event) => e.stopPropagation()}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === this.oscillatorNode.type}>${type}</option>`;
                })}
            </select>
        </div>`;
    }
}
