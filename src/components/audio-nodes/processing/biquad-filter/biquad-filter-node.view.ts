import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, BiquadFilterGraphNode, updateAudioParamValue } from "../../../../app/util";

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
    static styles = [audioNodeStyles];

    @property({ attribute: false }) readonly graphNode: BiquadFilterGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) connectToContext: () => void;

    private updateBiquadFilterParam<T extends keyof BiquadFilterNode>(param: T, value: BiquadFilterType | number) {
        const node = updateAudioParamValue(this.graphNode.node, { [param]: value } as Partial<Record<keyof BiquadFilterNode, string>>);
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class=${classMap({ node: true })}>
            <h2>Biquad Filter</h2>
            <select
                .value=${(this.graphNode.node as BiquadFilterNode).type}
                @change=${(e: Event) => {
                    this.updateBiquadFilterParam("type", (e.target as HTMLSelectElement).value as BiquadFilterType);
                }}
            >
                ${settableBiquadFilterTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === (this.graphNode.node as BiquadFilterNode).type}
                        >${type}</option
                    >`;
                })}
            </select>
            <div class="slider-container">
                <label>Frequency:</label>
                <input
                    type="range"
                    min="10"
                    max="22050"
                    default="440"
                    step="1"
                    .value="${(this.graphNode.node as BiquadFilterNode).frequency.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateBiquadFilterParam("frequency", (e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Detune:</label>
                <input
                    type="range"
                    min="-4800"
                    max="4800"
                    default="0"
                    step="1"
                    .value="${(this.graphNode.node as BiquadFilterNode).detune.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateBiquadFilterParam("detune", (e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Q:</label>
                <input
                    type="range"
                    min="0.0001"
                    max="1000"
                    default="1"
                    step="1"
                    .value="${(this.graphNode.node as BiquadFilterNode).Q.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateBiquadFilterParam("Q", (e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Gain:</label>
                <input
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.001"
                    .value="${(this.graphNode.node as BiquadFilterNode).gain.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateBiquadFilterParam("gain", (e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
        </div>`;
    }
}
