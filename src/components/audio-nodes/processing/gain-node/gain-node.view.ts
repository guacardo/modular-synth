import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, AudioParamName, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { classMap } from "lit/directives/class-map.js";
import { AudioDestinationGraphNode } from "../../destination/audio-destination-node/audio-destination-graph-node";
import { GainGraphNode } from "./gain-graph-node";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: GainGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private updateGain(value: number) {
        this.updateNode({
            ...this.graphNode,
            node: updateAudioParamValue(this.graphNode.node as GainNode, { gain: value } as Partial<Record<keyof GainNode, number>>),
        });
    }

    // TODO: DRY
    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs && this.nodeConnectState.source.id !== this.graphNode.id) {
            return true;
        }
        return false;
    }

    render() {
        // TODO: DRY
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
        const isGainModConnected = this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`);

        return html`<div class="node">
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
                    @input="${(e: Event) => {
                        this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                    }}"
                />
            </div>
            <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            <div class="button-io-container">
                <!-- IN -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connect": this.isConnectionCandidate(),
                            connected: isConnectedIn,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">in</label>
                </div>
                <!-- GAIN MODULATION -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connect": this.isConnectionCandidate(),
                            connected: isGainModConnected,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode, this.graphNode.node.gain, "gain")}
                    ></button>
                    <label class="io-label">gain mod</label>
                </div>
                <!-- OUT -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "connection-source": isConnectSource,
                            connected: isConnectedOut,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">out</label>
                </div>
            </div>
        </div>`;
    }
}
