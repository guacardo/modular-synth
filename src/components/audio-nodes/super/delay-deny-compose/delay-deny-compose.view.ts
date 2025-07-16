import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DelayDenyComposeGraphNode } from "./delay-deny-compose-node";
import { AudioGraphNode, updateAudioParamValue } from "../../../../app/util";
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
    @property({ attribute: false }) readonly updatePendingConnectionState: (id: string) => void;

    private updateAudioParam<T extends keyof DelayDenyComposeGraphNode, K extends keyof DelayDenyComposeGraphNode[T]>(
        nodeType: T,
        property: K,
        value: number | OscillatorType
    ) {
        const audioNode = this.graphNode[nodeType] as AudioNode;
        const updated = updateAudioParamValue(audioNode, { [property]: value });
        this.updateNode({
            ...this.graphNode,
            [nodeType]: updated,
        });
    }

    private updateSelected() {
        this.updateNode({ ...this.graphNode, isSelected: !this.graphNode.isSelected });
    }

    // TODO: DRY
    private setPulseWave(dutyCycle: number = 0.5) {
        const audioCtx = this.graphNode.node.context;
        const n = 4096; // Number of samples for the wave
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        for (let i = 1; i < n; i++) {
            // Fourier series for pulse wave
            real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * dutyCycle);
            imag[i] = 0;
        }

        this.graphNode.oscillator.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.graphNode.dutyCycle = dutyCycle;
        const newAudioGraphNode = { ...this.graphNode, node: this.graphNode.node, dutyCycle };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        // TODO: DRY
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
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
                        this.updateAudioParam("oscillator", "frequency", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.oscillator.detune.value.toString()}
                    .min=${-1200}
                    .max=${1200}
                    .step=${1}
                    .unit=${"Cents"}
                    .handleInput=${(event: Event) => {
                        this.updateAudioParam("oscillator", "detune", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.dutyCycle.toString()}
                    .min=${0}
                    .max=${1}
                    .step=${0.01}
                    .unit=${"Duty Cycle"}
                    .handleInput=${(event: Event) => {
                        this.setPulseWave((event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.delayNode.delayTime.value.toFixed(3).toString()}
                    .min=${0.001}
                    .max=${1.0}
                    .step=${0.001}
                    .unit=${"Delay Time"}
                    .handleInput=${(event: Event) => {
                        this.updateAudioParam("delayNode", "delayTime", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.feedbackGain.gain.value.toFixed(3).toString()}
                    .min=${0.001}
                    .max=${1.0}
                    .step=${0.001}
                    .unit=${"Feedback Gain"}
                    .handleInput=${(event: Event) => {
                        this.updateAudioParam("feedbackGain", "gain", (event.target as HTMLInputElement).valueAsNumber);
                    }}
                ></range-slider-view>
                <select
                    class="custom-select"
                    .value=${this.graphNode.oscillator.type}
                    @change=${(e: Event) => {
                        this.updateAudioParam("oscillator", "type", (e.target as HTMLSelectElement).value as OscillatorType);
                    }}
                >
                    ${settableOscillatorTypes.map((type) => {
                        return html`<option value=${type} ?selected=${type === this.graphNode.oscillator.type}>${type}</option>`;
                    })}
                    <option disabled value="custom" ?selected=${this.graphNode.oscillator.type === "custom"}>custom</option>
                </select>
                <div class="button-container">
                    <button class=${classMap({ button: true, "button-active": this.graphNode.isSelected })} type="button" @click=${this.updateSelected}>
                        keyboard
                    </button>
                </div>
                <div class="io-jack-container">
                    <!-- IN -->
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"in"}
                        .isConnected=${isConnectedIn}
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
                        .isConnected=${isConnectedOut}
                    ></input-output-jack-view>
                </div> </div
        ></div>`;
    }
}
