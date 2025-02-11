import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AddNodeHandler, AudioNodeWithId, BiquadFilterNodeWithId, GainNodeWithId, OscillatorNodeWithId } from "../../app/util";
import { audioGridStyles } from "./audio-grid.styles";
import { AudioGridItem } from "./audio-grid.store";

@customElement("audio-grid-view")
export class AudioGridView extends LitElement {
    static styles = [audioGridStyles];

    @property({ type: Array }) private audioGridItems: AudioGridItem[];
    @property({ type: Array }) private audioGraphNodes: AudioNodeWithId[];
    @property() private handleAddNode: AddNodeHandler;

    private getHighestRowPosition(): number {
        let max: number;
        if (this.audioGridItems.length === 0) {
            max = 0;
        } else {
            max = Math.max(...this.audioGridItems.map((item) => item.position[0]));
        }
        return max;
    }

    private getHighestColumnPosition(): number {
        let max: number;
        if (this.audioGridItems.length === 0) {
            max = -1;
        } else {
            max = Math.max(...this.audioGridItems.map((item) => item.position[1]));
        }
        console.log(max + 1);
        return max + 1;
    }

    renderAudioGraphNodeView(gridItem: AudioGridItem): TemplateResult {
        const node = this.audioGraphNodes.find((audioNode) => audioNode.id === gridItem.id) || { id: "oof", node: null };
        let type: string = "unknown";
        if (node instanceof GainNodeWithId) {
            type = "gain";
        } else if (node instanceof OscillatorNodeWithId) {
            type = "oscillator";
        } else if (node instanceof BiquadFilterNodeWithId) {
            type = "biquad-filter";
        }

        return html`<div class="audio-grid-item" style="grid-row: ${gridItem.position[0] + 1}; grid-column: ${gridItem.position[1] + 1};">
            ${type}
        </div>`;
    }

    renderAddNewNodeView(): TemplateResult {
        return html`<new-node-view .handleAddNode=${this.handleAddNode} .position=${[0, this.getHighestColumnPosition()]}></new-node-view>`;
    }

    render() {
        return html`<div class="grid">
            ${this.audioGridItems.map((item) => {
                return this.renderAudioGraphNodeView(item);
            })}
            ${this.renderAddNewNodeView()}
        </div>`;
    }
}
