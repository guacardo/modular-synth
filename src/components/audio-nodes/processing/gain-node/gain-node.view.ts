import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioDestinationGraphNode, AudioGraphNode, AudioParamName, GainGraphNode, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: GainGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
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
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
        const isGainModConnected = this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`);

        return html`<div class="node" @click=${() => this.onSelectAudioGraphNode(this.graphNode)}>
            <h2>gain</h2>
            <div class="slider-container">
                <label for="gain-slider-${this.graphNode.id}">level: ${(this.graphNode.node as GainNode).gain.value.toFixed(3)}</label>
                <input
                    id="gain-slider-${this.graphNode.id}"
                    class="slider"
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
            </div>
            <div class="button-io-container">
                <!-- IN -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({ "io-button": true, "can-connect": this.isConnectionCandidate(), connected: isConnectedIn })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">in</label>
                </div>
                <!-- GAIN MOD -->
                <div class="io-container">
                    <button
                        type="button"
                        class="io-button"
                        class=${classMap({ "io-button": true, "can-connect": this.isConnectionCandidate(), connected: isGainModConnected })}
                        @click=${() => this.updateNodeConnectState(this.graphNode, this.graphNode.node.gain, "gain")}
                    ></button>
                    <label class="io-label">gain mod</label>
                </div>
                <!-- OUT -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({ "io-button": true, "connection-source": isConnectSource, connected: isConnectedOut })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">out</label>
                </div>
            </div>
        </div>`;
    }
}
