import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";
import { OscillatorGraphNode } from "./oscillator-graph-node";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

// TODO: should make a an AudioNodeView interface/base class to reduce duplication, give implementation of update/select/keyboard/etc.
@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: OscillatorGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        return html`<div class="node">
            <h2 class="node-title"><span>oscillator</span></h2>
            <div class="sliders">
                <range-slider-view
                    .value=${this.graphNode.node.frequency.value.toString()}
                    .min=${0}
                    .max=${5000}
                    .step=${1}
                    .unit=${"Hz"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("frequency", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.node.detune.value.toString()}
                    .min=${-1200}
                    .max=${1200}
                    .step=${1}
                    .unit=${"Cents"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("detune", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.state.dutyCycle.toString()}
                    .min=${0}
                    .max=${1}
                    .step=${0.01}
                    .unit=${"Duty Cycle"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("dutyCycle", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.gainNode.gain.value.toFixed(2).toString()}
                    .min=${0}
                    .max=${1}
                    .step=${0.001}
                    .unit=${"Gain"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("gain", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
            </div>
            <select
                class="custom-select"
                .value=${this.graphNode.node.type}
                @change=${(e: Event) => {
                    this.updateNode(this.graphNode.updateState("type", (e.target as HTMLSelectElement).value as OscillatorType));
                }}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === this.graphNode.node.type}>${type}</option>`;
                })}
                <option disabled value="custom" ?selected=${this.graphNode.node.type === "custom"}>custom</option>
            </select>
            <div class="button-container">
                <button
                    class=${classMap({ button: true, "button-active": this.graphNode.state.isSelected })}
                    type="button"
                    @click=${() => this.updateNode(this.graphNode.updateState("isSelected", !this.graphNode.state.isSelected))}
                >
                    keyboard
                </button>
                <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            </div>
            <div class="io-jack-container">
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"out"}
                    .isConnected=${false}
                ></input-output-jack-view>
            </div>
        </div>`;
    }
}
