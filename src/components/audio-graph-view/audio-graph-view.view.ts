import { LitElement, TemplateResult, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AUDIO_DESTINATION_NODES, AUDIO_PROCESSOR_NODES, AUDIO_SOURCE_NODES, AudioGraphNode, AudioNodeType, Position } from "../../app/util";
import { audioGraphStyles } from "./audio-graph-view.styles";
import { OscillatorGraphNode } from "../audio-nodes/source/oscillator-node/oscillator-graph-node";
import { AudioDestinationGraphNode } from "../audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { GainGraphNode } from "../audio-nodes/processing/gain-node/gain-graph-node";
import { DelayGraphNode, StereoPannerGraphNode, DelayDenyComposeGraphNode } from "../audio-nodes";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ attribute: false, type: Array }) readonly audioGraph: AudioGraphNode[];
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false, type: Array }) readonly pendingConnectionState: [string, string];
    @property({ attribute: false }) readonly addNode: (type: AudioNodeType, position: Position) => void;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (id: string) => void;

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
        } else if (graphNode instanceof DelayGraphNode) {
            return html`<delay-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></delay-node-view>`;
        } else if (graphNode instanceof StereoPannerGraphNode) {
            return html`<stereo-panner-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></stereo-panner-view>`;
        } else if (graphNode instanceof DelayDenyComposeGraphNode) {
            return html`<delay-deny-compose-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .pendingConnectionState=${this.pendingConnectionState}
                .updateNode=${this.updateNode}
                .removeNode=${this.removeNode}
                .updatePendingConnectionState=${this.updatePendingConnectionState}
            ></delay-deny-compose-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }

    render() {
        return html`<div class="audio-graph-container">
            <div class="nodes-container audiograph-source-nodes">
                <h3>Source nodes</h3>
                <div class="audio-graph-node-container">
                    ${this.audioGraph.filter((node) => node instanceof OscillatorGraphNode).map((node) => this.renderNodeView(node))}
                </div>
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true} .options=${AUDIO_SOURCE_NODES}></new-node-view>
            </div>
            <div class="nodes-container audiograph-processor-nodes">
                <h3>Processor nodes</h3>
                <div class="audio-graph-node-container"
                    >${this.audioGraph
                        .filter((node) => node instanceof GainGraphNode || node instanceof BiquadFilterGraphNode)
                        .map((node) => this.renderNodeView(node))}</div
                >
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true} .options=${AUDIO_PROCESSOR_NODES}></new-node-view>
            </div>
            <div class="nodes-container audiograph-destination-nodes">
                <h3>Destination nodes</h3>
                <div class="audio-graph-node-container"
                    >${this.audioGraph.filter((node) => node instanceof AudioDestinationGraphNode).map((node) => this.renderNodeView(node))}</div
                >
                <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .gridStyle=${true} .options=${AUDIO_DESTINATION_NODES}></new-node-view>
            </div>
        </div>`;
    }
}
