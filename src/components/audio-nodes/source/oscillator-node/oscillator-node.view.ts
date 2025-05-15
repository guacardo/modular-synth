import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { graphNodeStyles } from "../../../../styles/graph-node-styles";
import { AudioGraphNode, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";

export const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) connectToContext: () => void;

    @state() private running: boolean;

    private updateFrequency(value: number) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { frequency: value } as Partial<Record<keyof OscillatorNode, number>>,
            this.graphNode.node.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private updateType(value: OscillatorType) {
        const node = updateAudioParamValue(
            this.graphNode.node as OscillatorNode,
            { type: value } as Partial<Record<keyof OscillatorNode, string>>,
            this.graphNode.node.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private startOscillator() {
        const node = this.graphNode.node as OscillatorNode;
        if (node && !this.running) {
            console.log("start");
            node.start();
            this.running = true;
        }
    }

    private stopOscillator() {
        const node = this.graphNode.node as OscillatorNode;
        if (node) {
            console.log("stop");
            node.stop();
            this.running = false;
        }
    }

    render() {
        return html`<div class=${classMap({ node: true, running: this.running })}>
            <h6>oscillator</h6>
            <input
                type="range"
                min="0"
                max="2000"
                .value="${(this.graphNode.node as OscillatorNode).frequency.value.toString()}"
                @input=${(e: Event) => {
                    this.updateFrequency((e.target as HTMLInputElement).valueAsNumber);
                }}
            />
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
            <button type="button" @click=${this.startOscillator}>Start</button>
            <button type="button" @click=${this.stopOscillator}>Stop</button>
        </div>`;
    }
}
