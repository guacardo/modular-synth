import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "../styles/side-panel-styles";
import { AudioGraph, GraphNode } from "../app/audio-graph";
import { dispatchNumericChange } from "../app/audio-node-change";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: Object })
    audioGraph?: AudioGraph;

    render() {
        return html` <div class="side-panel-container">
            <h1>Hello world side panel view</h1>
            <div class="audio-graph-node-container">${this.audioGraph?.graphNodes.map((node) => this.renderNodeView(node))}</div>
        </div>`;
    }

    private renderNodeView(node: GraphNode): TemplateResult {
        switch (node.type) {
            case `gain`:
                return html`<gain-node-view
                    .node=${node}
                    .destination=${this.audioGraph?.context.destination}
                    @gain-changed=${(e: Event) =>
                        dispatchNumericChange({ node: node, value: Number((e.target as HTMLInputElement).value), type: "gain" })}
                ></gain-node-view>`;
            case `osc`:
                return html`<oscillator-node-view .node=${node}></oscillator-node-view>`;
            case `biquad`:
                return html`<biquad-filter-node-view
                    .node=${node}
                    .destination=${this.audioGraph?.context.destination}
                ></biquad-filter-node-view>`;
        }
    }
}
