import { html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, AudioNodeType, Position } from "../app/util";
import { OscillatorGraphNode } from "../components/audio-nodes/source/oscillator-node/oscillator-graph-node";
import { willysRackShackStyles } from "./willys-rack-shack.styles";
import { DelayGraphNode } from "../components/audio-nodes/processing/delay/delay-graph-node";
import { StereoPannerGraphNode } from "../components/audio-nodes/processing/stereo-panner/stereo-panner-graph-node";
import { AudioDestinationGraphNode } from "../components/audio-nodes/destination/audio-destination-node/audio-destination-graph-node";
import { BiquadFilterGraphNode } from "../components/audio-nodes/processing/biquad-filter/biquad-filter-graph-node";
import { GainGraphNode } from "../components/audio-nodes/processing/gain-node/gain-graph-node";
import { DelayDenyComposeGraphNode } from "../components/audio-nodes/super/delay-deny-compose/delay-deny-compose-node";

@customElement("willys-rack-shack-view")
export class WillysRackShackView extends LitElement {
    static styles = [willysRackShackStyles];

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
                    <new-node-view .addNode=${this.addNode} .audioGraph=${this.audioGraph} .position=${[rowIndex, row.length + 1] as const}></new-node-view>
                </div>`;
            })}
        </div>`;
    }

    render() {
        return html` <div class="willys-rack-shack-container">${this.renderGrid()}</div> `;
    }
}
