import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioNodeWithId } from "../../app/util";
import { audioGridStyles } from "./audio-grid.styles";

type AudioGridItem = {
    id: string;
    position: [number, number];
};
@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    static styles = [audioGridStyles];

    @state() private audioGridItems: AudioGridItem[];
    @property({ type: Array }) private audioGraphNodes: AudioNodeWithId[];

    renderAudioGraphNodeView() {
        console.log(this.audioGridItems);
        console.log(this.audioGraphNodes);
    }

    render() {
        return html`<div class="grid">
            hey
            ${this.audioGraphNodes.map(() => {
                this.renderAudioGraphNodeView();
            })}
        </div>`;
    }
}
