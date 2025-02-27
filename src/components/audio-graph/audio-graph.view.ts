import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphStore } from "./audio-graph.store";
import { audioGraphStyles } from "./audio-graph.styles";
import { AddNodeHandler, AudioNodeProperties, GridAudioNode, GridBiquadFilterNode, GridGainNode, GridOscillatorNode } from "../../app/util";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object }) private audioGraph: AudioGraphStore;
    @property() private handleAddNode: AddNodeHandler;
    @property() handleUpdateNode: (node: GridAudioNode, properties: AudioNodeProperties) => void;

    render() {
        // todo: put this in a shareable util (side-panel.view.ts)
        return html`<div>
            ${this.audioGraph.gridAudioNodes.map((node) => {
                if (node instanceof GridGainNode) {
                    return html`<gain-node-view
                        .gainNode=${node}
                        .audioGraph=${this.audioGraph}
                        .handleUpdateNode=${this.handleUpdateNode}
                    ></gain-node-view>`;
                } else if (node instanceof GridOscillatorNode) {
                    return html`<oscillator-node-view
                        .oscillatorNode=${node}
                        .audioGraph=${this.audioGraph}
                        .handleUpdateNode=${this.handleUpdateNode}
                    ></oscillator-node-view>`;
                } else if (node instanceof GridBiquadFilterNode) {
                    return html`<biquad-filter-node-view
                        .biquadFilterNode=${node}
                        .destination=${this.audioGraph?.context.destination}
                    ></biquad-filter-node-view>`;
                } else {
                    return html`<p>ERroR: nOT a n Audio Noooode</p>`;
                }
            })}
            <new-node-view .handleAddNode=${this.handleAddNode} .position=${[0, 0]}></new-node-view>
        </div>`;
    }
}
