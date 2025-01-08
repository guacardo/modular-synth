import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraph } from "../app/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import "./biquad-filter-node-view";
import "./gain-node-view";
import "./oscillator-node-view";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object })
    audioGraph?: AudioGraph;

    render() {
        return html`<div>graph view</div>`;
    }
}
