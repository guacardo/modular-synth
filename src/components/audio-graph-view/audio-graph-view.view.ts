import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, AudioNodeType } from "../../app/util";
import { audioGraphStyles } from "./audio-graph-view.styles";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ attribute: false }) addNode: (type: AudioNodeType) => void;

    render() {
        return html`<div class="audio-graph-container">
            <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true}></new-node-view>
        </div>`;
    }
}
