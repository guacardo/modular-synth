import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraph } from "../../app/audio-graph";
import { GainNodeWithId } from "../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    /*
      seems like audioGraph property is what is triggering the re-render and not gainNode, should clean this up since doesn't
      look like an audioGraph is needed in here.
    */
    @property({ type: Object }) gainNode: GainNodeWithId;
    @property({ type: Object }) audioGraph: AudioGraph;
    @property() handleUpdateNode: (node: AudioNode, properties: Partial<Record<keyof GainNode, number>>) => void;

    static styles = [graphNodeStyles];

    private updateGain(value: number) {
        this.handleUpdateNode(this.gainNode.node, { gain: value });
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
