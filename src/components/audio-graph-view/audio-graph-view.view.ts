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
            <div class="nodes-container audiograph-source-nodes">
                <h3>Source nodes</h3>
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true}></new-node-view>
            </div>
            <div class="nodes-container audiograph-processor-nodes">
                <h3>Processor nodes</h3>
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true}></new-node-view>
            </div>
            <div class="nodes-container audiograph-destination-nodes">
                <h3>Destination nodes</h3>
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true}></new-node-view>
            </div>
        </div>`;
    }
}
