import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph } from "../../app/audio-graph";

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
        console.log(this.audioGraph);
    }

    render() {
        return html`<div>
            ${this.audioGridItems.map((gridItem) => {
                this.renderAudioGraphNodeView(gridItem);
            })}
        </div>`;
    }
}
