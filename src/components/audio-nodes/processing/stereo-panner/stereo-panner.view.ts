import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { StereoPannerGraphNode } from "./stereo-panner-graph-node";
import { audioNodeStyles } from "../../audio-node-styles";

@customElement("stereo-panner-view")
export class StereoPannerView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: StereoPannerGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        return html`
            <div class="node">
                <h2 class="node-title"><span>stereo panner</span></h2>
                <div class="sliders">
                    <range-slider-view
                        .value=${this.graphNode.node.pan.value.toFixed(3)}
                        .min=${-1}
                        .max=${1}
                        .step=${0.01}
                        .unit=${"pan"}
                        .handleInput=${(event: Event) => {
                            this.graphNode.updateState("pan", parseFloat((event.target as HTMLInputElement).value));
                        }}
                    ></range-slider-view>
                </div>
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
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"out"}
                        .isConnected=${false}
                    ></input-output-jack-view>
                </div>
            </div>
        `;
    }
}
