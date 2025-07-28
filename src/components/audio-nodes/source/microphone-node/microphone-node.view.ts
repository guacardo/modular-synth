import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { MicrophoneGraphNode } from "./microphone-graph-node";

@customElement("microphone-node-view")
export class MicrophoneNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: MicrophoneGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        return html`<div class="node">
            <h2 class="node-title"><span>microphone</span></h2>
            <div class="sliders">
                <range-slider-view
                    .value=${this.graphNode.gainNode.gain.value.toFixed(2).toString()}
                    .min=${0}
                    .max=${1}
                    .step=${0.001}
                    .unit=${"Gain"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("gain", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
            </div>
        </div>`;
    }
}
