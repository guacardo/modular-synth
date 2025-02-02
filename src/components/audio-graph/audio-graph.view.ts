import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraph } from "../../app/audio-graph";
import { audioGraphStyles } from "./audio-graph.styles";
import { GainNodeWithId } from "../../app/util";

@customElement("audio-graph-view")
export class AudioGraphView extends LitElement {
    static styles = [audioGraphStyles];

    @property({ type: Object }) private audioGraph: AudioGraph;
    @property() private handleAddNode: (node: AudioNode) => void;
    @property() handleUpdateNode: (
        node: AudioNode,
        properties: Partial<Record<keyof AudioNode, number | string | [number, number]>>
    ) => void;

    render() {
        // todo: put this in a shareable util (side-panel.view.ts)
        return html`<div>
            ${this.audioGraph.audioNodes.map((node) => {
                if (node instanceof GainNodeWithId) {
                    return html`<gain-node-view
                        .gainNode=${node}
                        .audioGraph=${this.audioGraph}
                        .handleUpdateNode=${this.handleUpdateNode}
                    ></gain-node-view>`;
                } else if (node instanceof OscillatorNode) {
                    return html`<oscillator-node-view
                        .oscillatorNode=${node}
                        .audioGraph=${this.audioGraph}
                        .handleUpdateNode=${this.handleUpdateNode}
                    ></oscillator-node-view>`;
                } else if (node instanceof BiquadFilterNode) {
                    return html`<biquad-filter-node-view
                        .biquadFilterNode=${node}
                        .destination=${this.audioGraph?.context.destination}
                    ></biquad-filter-node-view>`;
                } else {
                    return html`<p>ERroR: nOT a n Audio Noooode</p>`;
                }
            })}
            <new-node-view .handleAddNode=${this.handleAddNode}></new-node-view>
        </div>`;
    }
}
