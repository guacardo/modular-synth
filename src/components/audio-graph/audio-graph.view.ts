import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraph } from "../../app/audio-graph";
import { audioGraphStyles } from "./audio-graph.styles";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object })
    audioGraph: AudioGraph;

    render() {
        return html`<div>
            <p>graph view</p>
            <new-node-view>asdf</new-node-view>
        </div>`;
    }
}
