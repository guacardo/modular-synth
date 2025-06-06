import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [audioNodeStyles];

    // TODO: can graphNode be the specific type OscillatorNode? readonly?
    @property({ attribute: false, type: Object }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;

    @state() private running: boolean;
    @state() private dutyCycle: number = 0.5;

    private updateFrequency(value: number) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { frequency: value } as Partial<Record<keyof OscillatorNode, number>>
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private updateType(value: OscillatorType) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { type: value } as Partial<Record<keyof OscillatorNode, string>>
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private startOscillator() {
        const node = this.graphNode.node as OscillatorNode;
        if (node && !this.running) {
            node.start();
            this.running = true;
        }
    }

    private stopOscillator() {
        const node = this.graphNode.node as OscillatorNode;
        if (node) {
            node.stop();
            this.running = false;
        }
    }

    private setPulseWave(dutyCycle: number = 0.5) {
        const audioCtx = (this.graphNode.node as OscillatorNode).context;
        const n = 4096; // Number of samples for the wave
        const real = new Float32Array(n);
        const imag = new Float32Array(n);

        for (let i = 1; i < n; i++) {
            // Fourier series for pulse wave
            real[i] = (2 / (i * Math.PI)) * Math.sin(i * Math.PI * dutyCycle);
            imag[i] = 0;
        }

        (this.graphNode.node as OscillatorNode).setPeriodicWave(audioCtx.createPeriodicWave(real, imag));
        this.dutyCycle = dutyCycle;
    }

    render() {
        const audioNode = this.graphNode.node as OscillatorNode;
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        return html`<div
            class=${classMap({
                node: true,
                running: this.running,
                isConnectSource: isConnectSource,
            })}
        >
            <h2>oscillator</h2>
            <div class="slider-container">
                <label>Frequency: ${audioNode.frequency.value.toString()}</label>
                <input
                    class="range"
                    type="range"
                    min="0"
                    max="2000"
                    .value="${(this.graphNode.node as OscillatorNode).frequency.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateFrequency((e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
            <div class="slider-container">
                <label>Duty Cycle: ${this.dutyCycle.toFixed(2)}</label>
                <input
                    class="range"
                    type="range"
                    min="0.01"
                    max="0.99"
                    step="0.01"
                    .value="${this.dutyCycle.toString()}"
                    @input=${(e: Event) => this.setPulseWave((e.target as HTMLInputElement).valueAsNumber)}
                />
            </div>
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
            <button class="button" type="button" @click=${this.startOscillator}>Start</button>
            <button class="button" type="button" @click=${this.stopOscillator}>Stop</button>
            <button
                class=${classMap({ button: true, "button-active": isConnectSource })}
                type="button"
                @click=${() => this.updateNodeConnectState(this.graphNode)}
                >Connect</button
            >
        </div>`;
    }
}
