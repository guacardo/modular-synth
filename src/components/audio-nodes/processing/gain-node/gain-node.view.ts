import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, NodeConnectState, updateAudioParamValue } from "../../../../app/util";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [audioNodeStyles];

    // TODO: can graphNode be the specific type GainNode? readonly?
    @property({ type: Object, attribute: false }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;

    private updateGain(value: number) {
        const node = updateAudioParamValue(this.graphNode.node as GainNode, { gain: value } as Partial<Record<keyof GainNode, number>>);
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    render() {
        return html`<div class="node">
            <h2>gain</h2>
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
            <button type="button" @click=${() => this.updateNodeConnectState(this.graphNode)}>Connect</button>
        </div>`;
    }
}
