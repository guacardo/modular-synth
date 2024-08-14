import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph, Connection, GraphNode } from "../app/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import { FrequencyChangeDetail, OscillatorTypeChangeDetail } from "./oscillator-node-view";
import "./gain-node-view";
import "./oscillator-node-view";
import { GainChangeDetail } from "./gain-node-view";

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

    private handleGainChange(e: CustomEvent) {
        const gainChange = e.detail.gainChange as GainChangeDetail;
        this.audioGraph?.graphNodes?.map((node) => {
            if (node === gainChange.node) {
                (node.audioNode as GainNode).gain.exponentialRampToValueAtTime(
                    gainChange.gain,
                    this.audioGraph?.context.currentTime! + 0.1
                );
            }
        });
    }

    private renderNodeViews(node: GraphNode): TemplateResult {
        switch (node.type) {
            case `gain`:
                return html`<gain-node-view
                    .node=${node}
                    .destination=${this.audioGraph?.context.destination}
                    ?isSourceNode=${this._sourceNode === node}
                    @node-clicked=${this.handleNodeClick}
                    @gain-changed=${this.handleGainChange}
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

    private renderConnections(): TemplateResult {
        return html`${this.audioGraph?.graphNodes
            .map((node) => node.connections)
            ?.flat()
            .filter((connection, index, array) => array.indexOf(connection) === index)
            ?.map((connection) => this.renderConnection(connection))}`;
    }

    private renderConnection(connection: Connection): TemplateResult {
        return html`<p>${connection.sourceId}:${connection.destinationId}</p>`;
    }

    render() {
        return html` ${this.audioGraph?.graphNodes.map((node) => this.renderNodeViews(node))} ${this.renderConnections()} `;
    }
}
