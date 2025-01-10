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
    audioGraph?: AudioGraph;

    @property({ type: String, attribute: true })
    orientation?: Orientation;

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
        };
        return html` <div class="side-panel-container${classMap(classes)}">
            <div class="audio-graph-node-container">${this.audioGraph?.audioNodes.map((node) => this.renderNodeView(node))}</div>
        </div>`;
    }

    private renderNodeView(node: AudioNode): TemplateResult {
        return html`<p>audio node ${node}</p>`;
        // switch (node.type) {
        //     case `gain`:
        //         return html`<gain-node-view
        //             .node=${node}
        //             .destination=${this.audioGraph?.context.destination}
        //             .audioGraph=${this.audioGraph}
        //         ></gain-node-view>`;
        //     case `osc`:
        //         return html`<oscillator-node-view .node=${node}></oscillator-node-view>`;
        //     case `biquad`:
        //         return html`<biquad-filter-node-view
        //             .node=${node}
        //             .destination=${this.audioGraph?.context.destination}
        //         ></biquad-filter-node-view>`;
        // }
    }
}
