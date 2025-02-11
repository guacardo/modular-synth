import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioNodeWithId } from "../../app/util";
import { audioGridStyles } from "./audio-grid.styles";
import { AudioGridItem } from "./audio-grid.store";

@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    static styles = [audioGridStyles];

    @property({ type: Array }) private audioGridItems: AudioGridItem[];
    @property({ type: Array }) private audioGraphNodes: AudioNodeWithId[];

    renderAudioGraphNodeView(gridItem: AudioGridItem): TemplateResult {
        console.log(gridItem);
        return html`<div class="audio-grid-item">hey</div>`;
    }

    render() {
        return html`<div class="grid">
            ${this.audioGridItems.map((item) => {
                return this.renderAudioGraphNodeView(item);
            })}
        </div>`;
    }
}
