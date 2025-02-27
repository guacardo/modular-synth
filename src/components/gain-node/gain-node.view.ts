import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraphStore } from "../audio-graph/audio-graph.store";
import { GridAudioNode, GridGainNode } from "../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    /*
        TODO:
      seems like audioGraph property is what is triggering the re-render and not gainNode, should clean this up since doesn't
      look like an audioGraph is needed in here.

      Feb 10: is still true?
    */
    @property({ type: Object }) gainNode: GridGainNode;
    @property({ type: Object }) audioGraph: AudioGraphStore;
    @property() handleUpdateNode: (node: GridAudioNode, properties: Partial<Record<keyof GainNode, number>>) => void;

    static styles = [graphNodeStyles];

    private updateGain(value: number) {
        this.handleUpdateNode(this.gainNode, { gain: value });
    }

    render() {
        return html`<div class="node">
            <p>Gain ${this.gainNode.node.gain.value.toFixed(3)}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                .value="${this.gainNode.node.gain.value.toString()}"
                @input="${(e: Event) => {
                    this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                }}"
            />
        </div>`;
    }
}
