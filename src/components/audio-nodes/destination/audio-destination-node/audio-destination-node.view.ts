import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AUDIO_CONTEXT, AudioDestinationGraphNode, AudioGraphNode, NodeConnectState } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { classMap } from "lit/directives/class-map.js";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: AudioDestinationGraphNode;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioGraphNode) => void;

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs) {
            return true;
        }
        return false;
    }

    render() {
        console.log(this.graphNode);
        return html`
            <div class=${classMap({ node: true, connectionCandidate: this.isConnectionCandidate() })}>
                <h1>Audio Destination</h1>
                <p>Channel Count: ${this.graphNode.node.channelCount}</p>
                <p>Channel Interpretation: ${this.graphNode.node.channelInterpretation}</p>
                <p>Base Latency: ${AUDIO_CONTEXT.baseLatency}</p>
                <p>Output Latency: ${AUDIO_CONTEXT.outputLatency}</p>
                <button class="button" type="button" @click=${() => this.updateNodeConnectState(this.graphNode)}>Connect</button>
            </div>
        `;
    }
}
