import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { AudioGraph, GraphNode } from "../model/audio-graph";
import { audioGraphStyles } from "../styles/audio-graph-styles";
import "./gain-node-view";
import "./oscillator-node-view";
import { FrequencyChangeDetail, OscillatorTypeChangeDetail } from "./oscillator-node-view";

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
            this._sourceNode.audioNode.connect((e.detail.node as GraphNode).audioNode);
            this._sourceNode.connections = [...this._sourceNode.connections, (e.detail.node as GraphNode).id];
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

    render() {
        return html`
            <div class="container">
                ${this.audioGraph?.graphNodes?.map((node) => {
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
                })}
            </div>
        `;
    }
}
