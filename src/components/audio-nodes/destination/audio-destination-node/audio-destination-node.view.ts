import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, NodeConnectState } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioDestinationGraphNode } from "./audio-destination-graph-node";
import { getAudioContext } from "../../../../app/audio-context";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioDestinationGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs) {
            return true;
        }
        return false;
    }

    render() {
        const audioContext = getAudioContext();
        const isConnected = this.connections.some((connection) => connection[0] === this.graphNode.id || connection[1] === this.graphNode.id);
        return html`
            <div class=${classMap({ node: true, connectionCandidate: this.isConnectionCandidate() })}>
                <h1>audio destination</h1>
                <p>channels: ${this.graphNode.node.channelCount}</p>
                <p>channel interpretation: ${this.graphNode.node.channelInterpretation}</p>
                <p>base latency: ${audioContext.baseLatency}</p>
                <p>output latency: ${audioContext.outputLatency}</p>
                <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
                <!-- IN -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updateNodeConnectState=${this.updateNodeConnectState}
                    .label=${"in"}
                    .isConnected=${isConnected}
                    .canConnect=${this.isConnectionCandidate()}
                ></input-output-jack-view>
            </div>
        `;
    }
}
