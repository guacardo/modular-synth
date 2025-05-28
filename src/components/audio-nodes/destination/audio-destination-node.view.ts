import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("audio-destination-node-view")
export class AudioDestinationNodeView extends LitElement {
    @property({ type: Object, attribute: false }) node: AudioDestinationNode;
    render() {
        return html`
            <div class="audio-destination-node">
                <h1>Audio Destination</h1>
                <p>Channel Count: ${this.node.channelCount}</p>
                <p>Channel Interpretation: ${this.node.channelInterpretation}</p>
            </div>
        `;
    }
}
