import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AUDIO_CONTEXT, AudioGraphNode, NodeConnectState } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioDestinationGraphNode } from "./audio-destination-graph-node";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioDestinationGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs) {
            return true;
        }
        return false;
    }

    render() {
        const isConnected = this.connections.some((connection) => connection[0] === this.graphNode.id || connection[1] === this.graphNode.id);
        return html`
            <div class=${classMap({ node: true, connectionCandidate: this.isConnectionCandidate() })}>
                <h1>Audio Destination</h1>
                <p>Channel Count: ${this.graphNode.node.channelCount}</p>
                <p>Channel Interpretation: ${this.graphNode.node.channelInterpretation}</p>
                <p>Base Latency: ${AUDIO_CONTEXT.baseLatency}</p>
                <p>Output Latency: ${AUDIO_CONTEXT.outputLatency}</p>
                <!-- IN -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({ "io-button": true, "can-connect": this.isConnectionCandidate(), connected: isConnected })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">in</label>
                </div>
            </div>
        `;
    }
}
