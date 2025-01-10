import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraph } from "../../app/audio-graph";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ type: Object }) gainNode: GainNode;
    @property({ type: Object }) destination: AudioDestinationNode;
    @property({ type: Object }) audioGraph: AudioGraph;

    static styles = [graphNodeStyles];

    render() {
        console.dir(this.gainNode);
        return html`<div class="node">
            <p>gain</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                @input="${(e: Event) => {
                    this.audioGraph?.updateAudioNode(this.gainNode, { gain: Number((e.target as HTMLInputElement).value) });
                }}"
            />
        </div>`;
    }
}
