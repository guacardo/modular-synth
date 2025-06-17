import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioDestinationGraphNode, AudioGraphNode, AudioParamName, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { StereoPannerGraphNode } from "./stereo-panner-graph-node";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";

@customElement("stereo-panner-view")
export class StereoPannerView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: StereoPannerGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

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
        return html`
            <div class="node">
                <h2>stereo panner</h2>
                <div class="slider-container">
                    <label for="pan-slider">pan: ${(this.graphNode.node as StereoPannerNode).pan.value.toFixed(3)}</label>
                    <input
                        id="pan-slider"
                        class="slider"
                        type="range"
                        min="-1.0"
                        max="1.0"
                        step="0.01"
                        .value="${(this.graphNode.node as StereoPannerNode).pan.value.toString()}"
                        @input="${(e: Event) => {
                            this.updateNode({
                                ...this.graphNode,
                                node: updateAudioParamValue(this.graphNode.node, { pan: (e.target as HTMLInputElement).valueAsNumber }),
                            });
                        }}"
                    />
                </div>
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
            </div>
        `;
    }
}
