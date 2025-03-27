import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { BiquadFilterNodeView } from "./components/biquad-filter/biquad-filter-node.view";
import { GainNodeView } from "./components/gain-node/gain-node.view";
import { OscillatorNodeView } from "./components/oscillator-node/oscillator-node.view";
import { appStyles } from "./styles/app-styles";
import { SidePanelView } from "./components/side-panel/side-panel.view";
import { NewNodeView } from "./components/new-node/new-node.view";
import { AudioGraphNode } from "./app/util";
import "./components/biquad-filter/biquad-filter-node.view";
import "./components/gain-node/gain-node.view";
import "./components/oscillator-node/oscillator-node.view";
import "./components/new-node/new-node.view";
import "./components/side-panel/side-panel.view";

@customElement("app-view")
export class AppView extends LitElement {
    static styles = [appStyles];

    @state()
    AUDIO_GRAPH: AudioGraphNode[] = [];

    connectedCallback(): void {
        super.connectedCallback();
        console.log("connected: app-view", this);
    }

    render() {
        return html` <div class="app">
            <button @click=${() => console.log(this.AUDIO_GRAPH)}>Log Audio Graph</button>
            <audio-graph-view .audioGraph=${this.AUDIO_GRAPH}></audio-graph-view>
            <side-panel-view orientation="left" .audioGraph=${this.AUDIO_GRAPH}></side-panel-view>
            <side-panel-view orientation="right" .audioGraph=${this.AUDIO_GRAPH}></side-panel-view>
        </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "biquad-filter-node-view": BiquadFilterNodeView;
        "gain-node-view": GainNodeView;
        "new-node-view": NewNodeView;
        "oscillator-node-view": OscillatorNodeView;
        "side-panel-view": SidePanelView;
    }
}
