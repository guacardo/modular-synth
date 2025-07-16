import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioDestinationGraphNode } from "./audio-destination-graph-node";
import { getAudioContext } from "../../../../app/audio-context";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioDestinationGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updatePendingConnectionState: (id: string) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;

    render() {
        const audioContext = getAudioContext();
        const isConnected = this.connections.some((connection) => connection[0] === this.graphNode.id || connection[1] === this.graphNode.id);
        return html`
            <div class="node">
                <h2 class="node-title">audio destination</h2>
                <p>channels: ${this.graphNode.node.channelCount}</p>
                <p>channel interpretation: ${this.graphNode.node.channelInterpretation}</p>
                <p>base latency: ${audioContext.baseLatency}</p>
                <p>output latency: ${audioContext.outputLatency}</p>
                <div class="button-container">
                    <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
                </div>
                <div class="io-jack-container">
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"in"}
                        .isConnected=${isConnected}
                    ></input-output-jack-view>
                </div>
            </div>
        `;
    }
}
