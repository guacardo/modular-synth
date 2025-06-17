import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
    AUDIO_DESTINATION_NODES,
    AUDIO_PROCESSOR_NODES,
    AUDIO_SOURCE_NODES,
    AudioGraphNode,
    AudioNodeType,
    AudioParamName,
    NodeConnectState,
    Position,
} from "../app/util";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { willysRackShackStyles } from "./willys-rack-shack.styles";
import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { StereoPannerGraphNode } from "../components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { AudioDestinationGraphNode } from "../components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { GainGraphNode } from "../components/audio-nodes/processing/gain-node/gain-graph-node";

@customElement("willys-rack-shack-view")
export class WillysRackShackView extends LitElement {
    static styles = [willysRackShackStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) addNode: (type: AudioNodeType, position: Position) => void;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object })
    nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private renderNodeView(graphNode: AudioGraphNode): TemplateResult {
        if (graphNode instanceof GainGraphNode) {
            return html`<gain-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></gain-node-view>`;
        } else if (graphNode instanceof OscillatorGraphNode) {
            return html`<oscillator-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></oscillator-node-view>`;
        } else if (graphNode instanceof BiquadFilterGraphNode) {
            return html`<biquad-filter-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></biquad-filter-node-view>`;
        } else if (graphNode instanceof AudioDestinationGraphNode) {
            return html`<audio-destination-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
            ></audio-destination-node-view>`;
        } else if (graphNode instanceof DelayGraphNode) {
            return html`<delay-node-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></delay-node-view>`;
        } else if (graphNode instanceof StereoPannerGraphNode) {
            return html`<stereo-panner-view
                .graphNode=${graphNode}
                .connections=${this.connections}
                .updateNode=${this.updateNode}
                .nodeConnectState=${this.nodeConnectState}
                .updateNodeConnectState=${this.updateNodeConnectState}
                .onSelectAudioGraphNode=${this.onSelectAudioGraphNode}
            ></stereo-panner-view>`;
        } else {
            return html`<p>ERroR: nOT a n Audio Noooode</p>`;
        }
    }

    private buildGrid(): Array<AudioGraphNode[]> {
        const grid: Array<AudioGraphNode[]> = [[], [], [], [], []];

        for (const node of this.audioGraph) {
            const [row, col] = node.position;
            grid[row][col] = node;
        }

        return grid;
    }

    private renderGrid(): TemplateResult {
        const grid = this.buildGrid();

        return html` <div class="grid">
            ${grid.map((row, rowIndex) => {
                return html`<div class="grid-column">
                    ${row.map((node, colIndex) => {
                        return node ? html`<div class="graph-node-container" data-position="${rowIndex},${colIndex}">${this.renderNodeView(node)}</div>` : null;
                    })}
                    <new-node-view
                        .addNode=${this.addNode}
                        .audioGraph=${this.audioGraph}
                        .options=${[...AUDIO_DESTINATION_NODES, ...AUDIO_SOURCE_NODES, ...AUDIO_PROCESSOR_NODES]}
                        .position=${[rowIndex, row.length + 1] as const}
                    ></new-node-view>
                </div>`;
            })}
        </div>`;
    }

    render() {
        return html` <div class="willys-rack-shack-container">${this.renderGrid()}</div> `;
    }
}
