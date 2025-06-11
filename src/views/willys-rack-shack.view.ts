import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
    AUDIO_DESTINATION_NODES,
    AUDIO_PROCESSOR_NODES,
    AUDIO_SOURCE_NODES,
    AudioDestinationGraphNode,
    AudioGraphNode,
    AudioNodeType,
    BiquadFilterGraphNode,
    GainGraphNode,
    NodeConnectState,
} from "../app/util";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { willysRackShackStyles } from "./willys-rack-shack.styles";

@customElement("willys-rack-shack-view")
export class WillysRackShackView extends LitElement {
    static styles = [willysRackShackStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ attribute: false }) addNode: (type: AudioNodeType) => void;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode | AudioParam) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private renderNodeView(graphNode: AudioGraphNode): TemplateResult {
        if (graphNode instanceof GainGraphNode) {
            return html`<gain-node-view
                .graphNode=${graphNode}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></gain-node-view>`;
        } else if (graphNode instanceof OscillatorGraphNode) {
            return html`<oscillator-node-view
                .graphNode=${graphNode}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></oscillator-node-view>`;
        } else if (graphNode instanceof BiquadFilterGraphNode) {
            return html`<biquad-filter-node-view .graphNode=${graphNode} .updateNode=${this.updateNode}></biquad-filter-node-view>`;
        } else if (graphNode instanceof AudioDestinationGraphNode) {
            return html`<audio-destination-node-view
                .graphNode=${graphNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
            ></audio-destination-node-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }

    render() {
        return html`
            ${this.audioGraph.map((graphNode) => {
                return html`<div class="node" style="grid-column: ${graphNode.position[1]}; grid-row: ${graphNode.position[0]};">
                    ${this.renderNodeView(graphNode)}
                </div>`;
            })}
            <new-node-view
                .addNode=${this.addNode}
                .audioGraph=${this.audioGraph}
                .options=${[...AUDIO_DESTINATION_NODES, ...AUDIO_SOURCE_NODES, ...AUDIO_PROCESSOR_NODES]}
            ></new-node-view>
        `;
    }
}
