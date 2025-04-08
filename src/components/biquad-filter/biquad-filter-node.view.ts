import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, updateAudioParamValue } from "../../app/util";

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

    @property({ attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) connectToContext: () => void;

    private updateType(value: BiquadFilterType) {
        const node = updateAudioParamValue(
            this.graphNode.node as BiquadFilterNode,
            { type: value } as Partial<Record<keyof BiquadFilterNode, string>>,
            this.graphNode.node?.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class=${classMap({ node: true })}>
            <select
                .value=${(this.graphNode.node as BiquadFilterNode).type}
                @change=${(e: Event) => {
                    this.updateType((e.target as HTMLSelectElement).value as BiquadFilterType);
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
                    max="10000"
                    @input=${(e: Event) => {
                        console.log(e);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Detune:</label>
                <input
                    type="range"
                    @input=${(e: Event) => {
                        console.log(e);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Q:</label>
                <input
                    type="range"
                    @input=${(e: Event) => {
                        console.log(e);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Gain:</label>
                <input
                    type="range"
                    @input=${(e: Event) => {
                        console.log(e);
                    }}
                />
            </div>
        </div>`;
    }
}
