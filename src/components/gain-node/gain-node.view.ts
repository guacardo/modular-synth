import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraph } from "../../app/audio-graph";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ type: Object }) gainNode: GainNode;
    @property({ type: Object }) destination: AudioDestinationNode;
    @property({ type: Object }) audioGraph: AudioGraph;
    @property() handleUpdateNode: (node: AudioNode, properties: Partial<Record<keyof GainNode, number>>) => void;

    static styles = [graphNodeStyles];

    private updateGain(value: number) {
        this.handleUpdateNode(this.gainNode as GainNode, { gain: value });
    }

    render() {
        return html`<div class="node">
            <p>Gain ${this.gainNode.gain.value.toFixed(3)}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                value="${this.gainNode.gain.value}"
                @input="${(e: Event) => {
                    // this.audioGraph.updateAudioNode(this.gainNode, { gain: Number((e.target as HTMLInputElement).value) });
                    this.updateGain(Number((e.target as HTMLInputElement).value));
                }}"
            />
        </div>`;
    }
}
