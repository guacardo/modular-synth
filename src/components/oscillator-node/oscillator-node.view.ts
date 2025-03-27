import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraphNode, updateAudioParamValue } from "../../app/util";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;

    private updateFrequency(value: number) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { frequency: value } as Partial<Record<keyof OscillatorNode, number>>,
            this.graphNode.node?.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private updateType(value: OscillatorType) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { type: value } as Partial<Record<keyof OscillatorNode, string>>,
            this.graphNode.node?.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class="node">
            <h6>oscillator</h6>
            <input
                type="range"
                min="0"
                max="2000"
                .value="${(this.graphNode.node as OscillatorNode).frequency.value.toString()}"
                @input=${(e: Event) => {
                    this.updateFrequency((e.target as HTMLInputElement).valueAsNumber);
                }}
            />
            <select
                .value=${(this.graphNode.node as OscillatorNode).type}
                @change=${(e: Event) => {
                    this.updateType((e.target as HTMLSelectElement).value as OscillatorType);
                }}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === (this.graphNode.node as OscillatorNode).type}>${type}</option>`;
                })}
            </select>
        </div>`;
    }
}
