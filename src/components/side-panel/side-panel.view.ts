import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { AudioGraph } from "../../app/audio-graph";
import { classMap } from "lit/directives/class-map.js";
import { AudioNodeWithId, BiquadFilterNodeWithId, GainNodeWithId, OscillatorNodeWithId } from "../../app/util";

type Orientation = "left" | "right";
@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: Object })
    audioGraph: AudioGraph;

    @property({ type: String, attribute: true })
    orientation: Orientation;

    @property() handleUpdateNode: (
        node: AudioNodeWithId,
        properties: Partial<Record<keyof AudioNode, number | string | [number, number]>>
    ) => void;

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
        };
        return html` <div class="side-panel-container${classMap(classes)}">
            <div class="audio-graph-node-container">${this.audioGraph.audioNodes.map((node) => this.renderNodeView(node))}</div>
        </div>`;
    }

    // todo: put this in a shareable util (audio-graph.view.ts)
    private renderNodeView(node: AudioNodeWithId): TemplateResult {
        if (node instanceof GainNodeWithId) {
            return html`<gain-node-view
                .gainNode=${node}
                .audioGraph=${this.audioGraph}
                .handleUpdateNode=${this.handleUpdateNode}
            ></gain-node-view>`;
        } else if (node instanceof OscillatorNodeWithId) {
            return html`<oscillator-node-view
                .oscillatorNode=${node}
                .audioGraph=${this.audioGraph}
                .handleUpdateNode=${this.handleUpdateNode}
            ></oscillator-node-view>`;
        } else if (node instanceof BiquadFilterNodeWithId) {
            return html`<biquad-filter-node-view
                .biquadFilterNode=${node}
                .destination=${this.audioGraph?.context.destination}
            ></biquad-filter-node-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }
}
