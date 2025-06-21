import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DelayDenyComposeGraphNode } from "./delay-deny-compose-node";
import { AudioGraphNode, AudioParamName, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { settableOscillatorTypes } from "../../source/oscillator-node/oscillator-node.view";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioDestinationGraphNode } from "../../destination/audio-destination-node/audio-destination-graph-node";

@customElement("delay-deny-compose-view")
export class DelayDenyComposeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: DelayDenyComposeGraphNode;
    @property({ type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) readonly nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
    @property({ attribute: false }) readonly onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private updateAudioParam<T extends keyof DelayDenyComposeGraphNode, K extends keyof DelayDenyComposeGraphNode[T]>(
        nodeType: T,
        property: K,
        value: DelayDenyComposeGraphNode[T][K]
    ) {
        const updated = updateAudioParamValue(this.graphNode[nodeType] as AudioNode, { [property]: value });
        this.updateNode({
            ...this.graphNode,
            [nodeType]: updated,
        });
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

    // TODO: DRY
    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs && this.nodeConnectState.source.id !== this.graphNode.id) {
            return true;
        }
        return false;
    }

    render() {
        // TODO: DRY
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
        const isGainModConnected = this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`);
        return html`<div class="node">
            <h2>delay-deny-compose</h2>
            <div class="slider-container">
                <label class="label"><span class="unit">freq:</span> <span class="value">${this.graphNode.oscillator.frequency.value.toString()}</span></label>
                <input
                    class="slider"
                    type="range"
                    min="0"
                    max="2000"
                    .value="${this.graphNode.oscillator.frequency.value.toString()}"
                    @input=${(e: Event) => {
                        const freqParam = this.graphNode.oscillator.frequency;
                        freqParam.value = (e.target as HTMLInputElement).valueAsNumber;
                        this.updateAudioParam("oscillator", "frequency", freqParam);
                    }}
                />
            </div>
            <div class="slider-container">
                <label class="label"><span class="unit">cycle:</span> <span class="value">${this.graphNode.dutyCycle.toFixed(2)}</span></label>
                <input
                    class="slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    .value="${this.graphNode.dutyCycle.toString()}"
                    @input=${(e: Event) => this.setPulseWave((e.target as HTMLInputElement).valueAsNumber)}
                />
            </div>
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
            <div class="slider-container">
                <label>gain: ${this.graphNode.gainNode.gain.value.toFixed(3)}</label>
                <input
                    class="slider"
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.001"
                    .value="${this.graphNode.gainNode.gain.value.toString()}"
                    @input="${(e: Event) => {
                        const gainParam = this.graphNode.gainNode.gain;
                        gainParam.value = (e.target as HTMLInputElement).valueAsNumber;
                        this.updateAudioParam("gainNode", "gain", gainParam);
                    }}"
                />
            </div>
            <div class="slider-container">
                <label>delay: ${this.graphNode.delayNode.delayTime.value.toFixed(3)}</label>
                <input
                    class="slider"
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.001"
                    .value="${this.graphNode.delayNode.delayTime.value.toString()}"
                    @input="${(e: Event) => {
                        const delayParam = this.graphNode.delayNode.delayTime;
                        delayParam.value = (e.target as HTMLInputElement).valueAsNumber;
                        this.updateAudioParam("delayNode", "delayTime", delayParam);
                    }}"
                />
            </div>
            <div class="slider-container">
                <label for="gain-slider-${this.graphNode.id}">level: ${this.graphNode.delayNode.delayTime.value.toFixed(3)}</label>
                <input
                    id="gain-slider-${this.graphNode.id}"
                    class="slider"
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.001"
                    .value="${this.graphNode.delayNode.delayTime.value.toString()}"
                    @input="${(e: Event) => {
                        const delayParam = this.graphNode.delayNode.delayTime;
                        delayParam.value = (e.target as HTMLInputElement).valueAsNumber;
                        this.updateAudioParam("delayNode", "delayTime", delayParam);
                    }}"
                />
            </div>
            <div class="slider-container">
                <label>delay gain: ${this.graphNode.feedbackGain.gain.value.toFixed(3)}</label>
                <input
                    id="gain-slider-${this.graphNode.id}"
                    class="slider"
                    type="range"
                    min="0.001"
                    max="1.0"
                    step="0.001"
                    .value="${this.graphNode.feedbackGain.gain.value.toString()}"
                    @input="${(e: Event) => {
                        const feedbackGainParam = this.graphNode.feedbackGain.gain;
                        feedbackGainParam.value = (e.target as HTMLInputElement).valueAsNumber;
                        this.updateAudioParam("feedbackGain", "gain", feedbackGainParam);
                    }}"
                />
            </div>
            <div class="button-io-container">
                <!-- IN -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connect": this.isConnectionCandidate(),
                            connected: isConnectedIn,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">in</label>
                </div>
                <!-- GAIN MODULATION -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connect": this.isConnectionCandidate(),
                            connected: isGainModConnected,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode, this.graphNode.gainNode.gain, "gain")}
                    ></button>
                    <label class="io-label">gain mod</label>
                </div>
                <!-- OUT -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "connection-source": isConnectSource,
                            connected: isConnectedOut,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">out</label>
                </div>
            </div>
        </div>`;
    }
}
