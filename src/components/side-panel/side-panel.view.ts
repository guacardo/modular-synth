import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { classMap } from "lit/directives/class-map.js";
import { AUDIO_DESTINATION_NODES, AUDIO_PROCESSOR_NODES, AUDIO_SOURCE_NODES, AudioGraphNode, AudioNodeType, Position } from "../../app/util";
import { OscillatorGraphNode } from "../audio-nodes/source/oscillator-node/oscillator-graph-node";
import { AudioDestinationGraphNode } from "../audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { GainGraphNode } from "../audio-nodes/processing/gain-node/gain-graph-node";

type Orientation = "left" | "right";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ attribute: false, type: Array }) readonly audioGraph: AudioGraphNode[];
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false, type: Array }) readonly pendingConnectionState: [string, string];
    @property({ attribute: false }) readonly addNode: (type: AudioNodeType, position: Position) => void;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (id: string) => void;
    @property({ type: String, attribute: true }) orientation: Orientation;

    connectedCallback(): void {
        super.connectedCallback();
    }

    private renderNodeView(graphNode: AudioGraphNode): TemplateResult {
        if (graphNode instanceof GainGraphNode) {
            return html`<gain-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></gain-node-view>`;
        } else if (graphNode instanceof OscillatorGraphNode) {
            return html`<oscillator-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></oscillator-node-view>`;
        } else if (graphNode instanceof BiquadFilterGraphNode) {
            return html`<biquad-filter-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></biquad-filter-node-view>`;
        } else if (graphNode instanceof AudioDestinationGraphNode) {
            return html`<audio-destination-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
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
