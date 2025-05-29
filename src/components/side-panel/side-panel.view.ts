import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { classMap } from "lit/directives/class-map.js";
import {
    AUDIO_DESTINATION_NODES,
    AUDIO_PROCESSOR_NODES,
    AUDIO_SOURCE_NODES,
    AudioGraphNode,
    AudioNodeType,
    NodeConnectState,
} from "../../app/util";

type Orientation = "left" | "right";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: String, attribute: true }) orientation: Orientation;
    @property({ attribute: false }) addNode: (type: AudioNodeType) => void;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode | AudioDestinationNode) => void;

    connectedCallback(): void {
        super.connectedCallback();
    }

    private renderNodeView(graphNode: AudioGraphNode): TemplateResult {
        if (graphNode.node instanceof GainNode) {
            return html`<gain-node-view
                .graphNode=${graphNode}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
            ></gain-node-view>`;
        } else if (graphNode.node instanceof OscillatorNode) {
            return html`<oscillator-node-view
                .graphNode=${graphNode}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
            ></oscillator-node-view>`;
        } else if (graphNode.node instanceof AudioDestinationNode) {
            return html`<audio-destination-node-view
                .node=${graphNode.node}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
            ></audio-destination-node-view>`;
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
            <div class="audio-graph-node-container">${this.audioGraph.map((node) => this.renderNodeView(node))}</div>
            <new-node-view
                .addNode=${this.addNode}
                .audioGraph=${this.audioGraph}
                .options=${[...AUDIO_DESTINATION_NODES, ...AUDIO_SOURCE_NODES, ...AUDIO_PROCESSOR_NODES]}
            ></new-node-view>
        </div>`;
    }
}
