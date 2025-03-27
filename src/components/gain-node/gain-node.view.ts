import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../../styles/graph-node-styles";
import { AudioGraphNode, updateAudioParamValue } from "../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ type: Object, attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;

    static styles = [graphNodeStyles];

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
        console.log(this.graphNode);
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
        </div>`;
    }
}
