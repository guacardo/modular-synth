import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioDestinationGraphNode } from "./audio-destination-graph-node";
import { getAudioContext } from "../../../../app/audio-context";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioDestinationGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        const audioContext = getAudioContext();
        return html`
            <div class="node">
                <h2 class="node-title"><span>audio destination</span></h2>
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
                        .isConnected=${false}
                    ></input-output-jack-view>
                </div>
            </div>
        `;
    }
}
