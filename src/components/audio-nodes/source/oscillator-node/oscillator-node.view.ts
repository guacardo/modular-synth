import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";
import { OscillatorGraphNode } from "./oscillator-graph-node";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: OscillatorGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private updateOscillatorParam<T extends keyof OscillatorNode>(property: T, value: number | OscillatorType) {
        this.updateNode({ ...this.graphNode, node: updateAudioParamValue(this.graphNode.node, { [property]: value }) });
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
        const audioNode = this.graphNode.node;
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        const isConnected = this.connections.some((connection) => connection[0] === this.graphNode.id || connection[1] === this.graphNode.id);
        return html`<div class="node">
            <h2>oscillator</h2>
            <div class="slider-container">
                <label class="label"><span class="unit">freq:</span> <span class="value">${audioNode.frequency.value.toString()}</span></label>
                <input
                    class="slider"
                    type="range"
                    min="0"
                    max="2000"
                    .value="${this.graphNode.node.frequency.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateOscillatorParam("frequency", (e.target as HTMLInputElement).valueAsNumber);
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
            <button
                class=${classMap({ button: true, "button-active": this.graphNode.isSelected })}
                type="button"
                @click=${() => this.onSelectAudioGraphNode(this.graphNode)}
            >
                keyboard
            </button>
            <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            <div class="io-container">
                <button
                    type="button"
                    class=${classMap({ "io-button": true, "connection-source": isConnectSource, connected: isConnected })}
                    @click=${() => this.updateNodeConnectState(this.graphNode)}
                ></button>
                <label class="io-label">out</label>
            </div>
        </div>`;
    }
}
