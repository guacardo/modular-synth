import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { AudioGraph } from "../../app/audio-graph";
import { classMap } from "lit/directives/class-map.js";

type Orientation = "left" | "right";
@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: Object })
    audioGraph: AudioGraph;

    @property({ type: String, attribute: true })
    orientation: Orientation;

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
        };
        return html` <div class="side-panel-container${classMap(classes)}">
            <div class="audio-graph-node-container">${this.audioGraph.audioNodes.map((node) => this.renderNodeView(node))}</div>
        </div>`;
    }

    private renderNodeView(node: AudioNode): TemplateResult {
        if (node instanceof GainNode) {
            return html`<gain-node-view
                .gainNode=${node}
                .destination=${this.audioGraph.context.destination}
                .audioGraph=${this.audioGraph}
            ></gain-node-view>`;
        } else if (node instanceof OscillatorNode) {
            return html`<oscillator-node-view .oscillatorNode=${node}></oscillator-node-view>`;
        } else if (node instanceof BiquadFilterNode) {
            return html`<biquad-filter-node-view
                .biquadFilterNode=${node}
                .destination=${this.audioGraph?.context.destination}
            ></biquad-filter-node-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }
}
