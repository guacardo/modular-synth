import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph, Connection, GraphNode } from "../model/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import { FrequencyChangeDetail, OscillatorTypeChangeDetail } from "./oscillator-node-view";
import "./gain-node-view";
import "./oscillator-node-view";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object })
    audioGraph?: AudioGraph;

    @state()
    protected _sourceNode?: GraphNode;

    private handleNodeClick(e: CustomEvent) {
        if (this._sourceNode === undefined) {
            this._sourceNode = e.detail.node;
        } else if (this._sourceNode === e.detail.node) {
            this._sourceNode = undefined;
        } else if (this._sourceNode !== e.detail.node) {
            const connection: Connection = { sourceId: this._sourceNode.id, destinationId: (e.detail.node as GraphNode).id };
            (e.detail.node as GraphNode).connections = [...(e.detail.node as GraphNode).connections, connection];
            this._sourceNode.connections = [...this._sourceNode.connections, connection];
            this._sourceNode.audioNode.connect((e.detail.node as GraphNode).audioNode);
            this._sourceNode = undefined;
        }
    }

    private handleFrequencyChange(e: CustomEvent) {
        const frequencyChange = e.detail.frequencyChange as FrequencyChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === frequencyChange.node) {
                (node.audioNode as OscillatorNode).frequency.setValueAtTime(
                    frequencyChange.frequency,
                    this.audioGraph?.context.currentTime!
                );
            }
        });
    }

    private handleOscillatorTypeChange(e: CustomEvent) {
        const typeChange = e.detail.typeChange as OscillatorTypeChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === typeChange.node) {
                (node.audioNode as OscillatorNode).type = typeChange.type;
            }
        });
    }

    private nodeById(key: string): GraphNode | undefined {
        return this.audioGraph?.graphNodes.find((node) => node.id === key);
    }

    private renderNodeView(node: GraphNode) {
        switch (node.type) {
            case `gain`:
                return html`<gain-node-view
                    .node=${node}
                    ?isSourceNode=${this._sourceNode === node}
                    @node-clicked=${this.handleNodeClick}
                ></gain-node-view>`;
            case `osc`:
                return html`<oscillator-node-view
                    .node=${node}
                    ?isSourceNode=${this._sourceNode === node}
                    @node-clicked=${this.handleNodeClick}
                    @frequency-change=${this.handleFrequencyChange}
                    @type-change=${this.handleOscillatorTypeChange}
                ></oscillator-node-view>`;
        }
    }

    render() {
        console.log(this.audioGraph?.graphNodes);
        return html` <div class="container"> ${this.audioGraph?.graphNodes.map((node) => this.renderNodeView(node))} </div> `;
    }
}
