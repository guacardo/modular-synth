import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraph } from "../../app/audio-graph";
import { audioGraphStyles } from "./audio-graph.styles";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object }) private audioGraph: AudioGraph;
    @property() private handleAddNode: (node: AudioNode) => void;

    render() {
        return html`<div>
            <new-node-view .handleAddNode=${this.handleAddNode}>asdf</new-node-view>
        </div>`;
    }
}
