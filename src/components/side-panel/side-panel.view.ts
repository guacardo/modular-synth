import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, AudioNodeType } from "../../app/util";

type Orientation = "left" | "right";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: String, attribute: true }) orientation: Orientation;
    @property() addNode: (type: AudioNodeType) => void;

    connectedCallback(): void {
        super.connectedCallback();
        console.log("connected: side-panel-view", this);
    }

    private renderNodeView(node: AudioGraphNode): TemplateResult {
        if (node.node instanceof GainNode) {
            return html`<gain-node-view .gainNode=${node}></gain-node-view>`;
        } else if (node.node instanceof OscillatorNode) {
            return html`<oscillator-node-view .oscillatorNode=${node}></oscillator-node-view>`;
        } else if (node instanceof BiquadFilterNode) {
            return html`<biquad-filter-node-view .biquadFilterNode=${node}></biquad-filter-node-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
        };
        return html` <div class="side-panel-container${classMap(classes)}">
            <new-node-view .addNode=${this.addNode}></new-node-view>
            <div class="audio-graph-node-container">${this.audioGraph.map((node) => this.renderNodeView(node))}</div>
        </div>`;
    }
}
