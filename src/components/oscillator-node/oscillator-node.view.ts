import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraph } from "../../app/audio-graph";

// export higher up? types file?
const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ type: Object }) oscillatorNode: OscillatorNode;
    @property({ type: Object }) audioGraph: AudioGraph;
    @property() handleUpdateNode: (node: AudioNode, properties: Partial<Record<keyof OscillatorNode, number | OscillatorType>>) => void;

    private updateFrequency(value: number) {
        this.handleUpdateNode(this.oscillatorNode, { frequency: value });
    }

    private updateType(value: OscillatorType) {
        this.handleUpdateNode(this.oscillatorNode, { type: value });
    }

    render() {
        return html`<div class="node">
            <h6>oscillator</h6>
            <input
                type="range"
                min="0"
                max="2000"
                .value="${this.oscillatorNode.frequency.value.toString()}"
                @input=${(e: Event) => {
                    this.updateFrequency((e.target as HTMLInputElement).valueAsNumber);
                }}
            />
            <select
                .value=${this.oscillatorNode.type}
                @change=${(e: Event) => {
                    this.updateType((e.target as HTMLSelectElement).value as OscillatorType);
                }}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === this.oscillatorNode.type}>${type}</option>`;
                })}
            </select>
        </div>`;
    }
}
