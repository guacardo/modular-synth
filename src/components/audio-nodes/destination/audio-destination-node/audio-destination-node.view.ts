import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AUDIO_CONTEXT, NodeConnectState } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) node: AudioDestinationNode;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (node: AudioDestinationNode) => void;

    render() {
        return html`
            <div class="node">
                <h1>Audio Destination</h1>
                <p>Channel Count: ${this.node.channelCount}</p>
                <p>Channel Interpretation: ${this.node.channelInterpretation}</p>
                <p>Base Latency: ${AUDIO_CONTEXT.baseLatency}</p>
                <p>Output Latency: ${AUDIO_CONTEXT.outputLatency}</p>
                <button type="button" @click=${() => this.updateNodeConnectState(this.node)}>Connect</button>
            </div>
        `;
    }
}
