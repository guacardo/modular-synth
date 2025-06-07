import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, GainGraphNode, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: GainGraphNode;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode | AudioParam) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private updateGain(value: number) {
        const node = updateAudioParamValue(this.graphNode.node as GainNode, { gain: value } as Partial<Record<keyof GainNode, number>>);
        const newAudioGraphNode = { ...this.graphNode, node };
        this.updateNode(newAudioGraphNode);
    }

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs && this.nodeConnectState.source.id !== this.graphNode.id) {
            return true;
        }
        return false;
    }

    render() {
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        return html`<div
            class=${classMap({
                node: true,
                isConnectSource: isConnectSource,
                connectionCandidate: this.isConnectionCandidate(),
            })}
            @click=${() => this.onSelectAudioGraphNode(this.graphNode)}
        >
            <h2>gain</h2>
            <p>Gain ${(this.graphNode.node as GainNode).gain.value.toFixed(3)}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                .value="${(this.graphNode.node as GainNode).gain.value.toString()}"
                @click=${(e: MouseEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                @input="${(e: Event) => {
                    this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                }}"
            />
            <button
                class=${classMap({ button: true, "button-active": isConnectSource })}
                type="button"
                @click=${() => this.updateNodeConnectState(this.graphNode)}
                >Connect</button
            >
            <button class="button" @click=${() => this.updateNodeConnectState((this.graphNode.node as GainNode).gain)}
                >Connect to Gain</button
            >
        </div>`;
    }
}
