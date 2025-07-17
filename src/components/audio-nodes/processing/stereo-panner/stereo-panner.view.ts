import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AudioGraphNode, updateAudioParamValue } from "../../../../app/util";
import { StereoPannerGraphNode } from "./stereo-panner-graph-node";
import { audioNodeStyles } from "../../audio-node-styles";

@customElement("stereo-panner-view")
export class StereoPannerView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: StereoPannerGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (id: string) => void;

    render() {
        // TODO: DRY
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
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
                            this.updateNode({
                                ...this.graphNode,
                                node: updateAudioParamValue(this.graphNode.node, { pan: (event.target as HTMLInputElement).valueAsNumber }),
                            });
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
                        .isConnected=${isConnectedIn}
                    ></input-output-jack-view>
                    <input-output-jack-view
                        .graphNode=${this.graphNode}
                        .updatePendingConnectionState=${this.updatePendingConnectionState}
                        .label=${"out"}
                        .isConnected=${isConnectedOut}
                    ></input-output-jack-view>
                </div>
            </div>
        `;
    }
}
