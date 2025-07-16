import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, AudioParamName, updateAudioParamValue } from "../../../../app/util";
import { BiquadFilterGraphNode } from "./biquad-filter-graph-node";
import { AudioDestinationGraphNode } from "../../destination/audio-destination-node/audio-destination-graph-node";

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
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) updatePendingConnectionState: (id: string) => void;

    private updateBiquadFilterParam<T extends keyof BiquadFilterNode>(param: T, value: BiquadFilterType | number) {
        const node = updateAudioParamValue(this.graphNode.node, {
            [param]: value,
        });
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class="node">
            <h2 class="node-title"><span>Biquad Filter</span></h2>
            <select
                class="custom-select"
                .value=${(this.graphNode.node as BiquadFilterNode).type}
                @change=${(e: Event) => {
                    this.updateBiquadFilterParam("type", (e.target as HTMLSelectElement).value as BiquadFilterType);
                }}
            >
                ${settableBiquadFilterTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === (this.graphNode.node as BiquadFilterNode).type}>${type}</option>`;
                })}
            </select>
            <div class="sliders">
                <range-slider-view
                    .value=${(this.graphNode.node as BiquadFilterNode).frequency.value.toString()}
                    .min=${10}
                    .max=${22050}
                    .step=${1}
                    .unit=${"Hz"}
                    .handleInput=${(event: Event) => {
                        this.updateBiquadFilterParam("frequency", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${(this.graphNode.node as BiquadFilterNode).detune.value.toString()}
                    .min=${-4800}
                    .max=${4800}
                    .step=${1}
                    .unit=${"Cents"}
                    .handleInput=${(event: Event) => {
                        this.updateBiquadFilterParam("detune", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${(this.graphNode.node as BiquadFilterNode).Q.value.toString()}
                    .min=${0.0001}
                    .max=${1000}
                    .step=${1}
                    .unit=${"Q"}
                    .handleInput=${(event: Event) => {
                        this.updateBiquadFilterParam("Q", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${(this.graphNode.node as BiquadFilterNode).gain.value.toFixed(2).toString()}
                    .min=${-40}
                    .max=${40}
                    .step=${0.01}
                    .unit=${"Gain"}
                    .handleInput=${(event: Event) => {
                        this.updateBiquadFilterParam("gain", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
            </div>
            <div class="button-container">
                <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            </div>
            <div class="io-jack-container">
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"in"}
                    .isConnected=${this.connections.some((connection) => connection[1] === `${this.graphNode.id}`)}
                ></input-output-jack-view>
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"out"}
                    .isConnected=${this.connections.some((connection) => connection[1] === `${this.graphNode.id}`)}
                ></input-output-jack-view>
            </div>
        </div>`;
    }
}
