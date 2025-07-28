import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DelayDenyComposeGraphNode } from "./delay-deny-compose-node";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { settableOscillatorTypes } from "../../source/oscillator-node/oscillator-node.view";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";

@customElement("delay-deny-compose-view")
export class DelayDenyComposeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: DelayDenyComposeGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        const isGainModConnected = this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`);
        return html`<div class="node">
            <h2 class="node-title"><span>delay-deny-compose</span></h2>
            <div class="sliders">
                <range-slider-view
                    .value=${this.graphNode.oscillator.frequency.value.toString()}
                    .min=${0}
                    .max=${5000}
                    .step=${1}
                    .unit=${"Hz"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("frequency", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.oscillator.detune.value.toString()}
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
                    .value=${this.graphNode.delayNode.delayTime.value.toFixed(3).toString()}
                    .min=${0.001}
                    .max=${1.0}
                    .step=${0.001}
                    .unit=${"Delay Time"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("delayTime", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.feedbackGain.gain.value.toFixed(3).toString()}
                    .min=${0.001}
                    .max=${1.0}
                    .step=${0.001}
                    .unit=${"Feedback Gain"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("feedbackGain", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <select
                    class="custom-select"
                    .value=${this.graphNode.oscillator.type}
                    @change=${(e: Event) => {
                        this.updateNode(this.graphNode.updateState("type", (e.target as HTMLSelectElement).value as OscillatorType));
                    }}
                >
                    ${settableOscillatorTypes.map((type) => {
                        return html`<option value=${type} ?selected=${type === this.graphNode.oscillator.type}>${type}</option>`;
                    })}
                    <option disabled value="custom" ?selected=${this.graphNode.oscillator.type === "custom"}>custom</option>
                </select>
                <div class="button-container">
                    <button
                        class=${classMap({ button: true, "button-active": this.graphNode.isSelected })}
                        type="button"
                        @click=${() => this.updateNode(this.graphNode.updateState("isSelected", !this.graphNode.state.isSelected))}
                    >
                        keyboard
                    </button>
                </div>
                <div class="io-jack-container">
                    <!-- IN -->
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"in"}
                        .isConnected=${false}
                    ></input-output-jack-view>
                    <!-- GAIN MODULATION -->
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"mod"}
                        .isConnected=${isGainModConnected}
                        .param=${this.graphNode.gainNode.gain}
                        .paramName=${"gain"}
                    ></input-output-jack-view>
                    <!-- OUT -->
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"out"}
                        .isConnected=${false}
                    ></input-output-jack-view>
                </div> </div
        ></div>`;
    }
}
