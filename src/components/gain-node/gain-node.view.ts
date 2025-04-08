import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraphNode, updateAudioParamValue } from "../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) connectToContext: () => void;

    private updateGain(value: number) {
        const node = updateAudioParamValue(
            this.graphNode.node as GainNode,
            { gain: value } as Partial<Record<keyof GainNode, number>>,
            this.graphNode.node?.context as AudioContext
        );
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class="node">
            <p>Gain ${(this.graphNode.node as GainNode).gain.value.toFixed(3)}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                .value="${(this.graphNode.node as GainNode).gain.value.toString()}"
                @input="${(e: Event) => {
                    this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                }}"
            />
            <button type="button" @click=${this.connectToContext}>Connect to Context</button>
        </div>`;
    }
}
