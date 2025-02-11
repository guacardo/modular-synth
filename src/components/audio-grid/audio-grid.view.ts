import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph } from "../../app/audio-graph";
import { AudioNodeWithId } from "../../app/util";

type AudioGridItem = {
    id: string;
    position: [number, number];
};
@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    @state() private audioGridItems: AudioGridItem[];
    @property({ type: Object }) private audioGraph: AudioGraph;

    renderAudioGraphNodeView(gridItem: AudioGridItem) {
        console.log(gridItem);
        // const node = this.audioGraph.audioNodes.find((node) => node. === gridItem.id);
        // console.log(node);
    }

    render() {
        return html`<div>
            ${this.audioGridItems.map((gridItem) => {
                this.renderAudioGraphNodeView(gridItem);
            })}
        </div>`;
    }
}
