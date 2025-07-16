import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";
import { OscillatorGraphNode } from "./oscillator-graph-node";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

// TODO: should make a an AudioNodeView interface/base class to reduce duplication, give implementation of update/select/keyboard/etc.
@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: OscillatorGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) updatePendingConnectionState: (id: string) => void;

    private updateOscillatorParam<T extends keyof OscillatorNode>(property: T, value: number | OscillatorType) {
        this.updateNode({ ...this.graphNode, node: updateAudioParamValue(this.graphNode.node, { [property]: value }) });
    }

    private updateGain(value: number) {
        this.graphNode.updateGain(value);
        this.updateNode({ ...this.graphNode });
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

        this.graphNode.node.setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.graphNode.dutyCycle = dutyCycle;
        const newAudioGraphNode = { ...this.graphNode, node: this.graphNode.node, dutyCycle };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        const isConnected = this.connections.some((connection) => connection[0] === this.graphNode.id || connection[1] === this.graphNode.id);
        return html`<div class="node">
            <h2 class="node-title"><span>oscillator</span></h2>
            <range-slider-view
                .value=${this.graphNode.node.frequency.value.toString()}
                .min=${0}
                .max=${5000}
                .step=${1}
                .unit=${"Hz"}
                .handleInput=${(event: Event) => {
                    this.updateOscillatorParam("frequency", (event.target as HTMLInputElement).valueAsNumber);
                }}
            ></range-slider-view>

            <div class="slider-container">
                <label class="label"><span class="unit">gain:</span> <span class="value">${this.graphNode.gainNode.gain.value.toFixed(3)}</span></label>
                <input
                    class="slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    .value="${this.graphNode.gainNode.gain.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateGain((e.target as HTMLInputElement).valueAsNumber);
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
                .value=${this.graphNode.node.type}
                @change=${(e: Event) => {
                    this.updateOscillatorParam("type", (e.target as HTMLSelectElement).value as OscillatorType);
                }}
            >
                ${settableOscillatorTypes.map((type) => {
                    return html`<option value=${type} ?selected=${type === this.graphNode.node.type}>${type}</option>`;
                })}
                <option disabled value="custom" ?selected=${this.graphNode.node.type === "custom"}>custom</option>
            </select>
            <button class=${classMap({ button: true, "button-active": this.graphNode.isSelected })} type="button" @click=${this.updateSelected}>
                keyboard
            </button>
            <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            <div class="io-container">
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"out"}
                    .isConnected=${isConnected}
                ></input-output-jack-view>
            </div>
        </div>`;
    }
}
