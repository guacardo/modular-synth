import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DelayGraphNode } from "./delay-graph-node";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";

@customElement("delay-node-view")
export class DelayNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: DelayGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    render() {
        return html`<div class="node">
            <h2 class="node-title"><span>delay</span></h2>
            <div class="sliders">
                <range-slider-view
                    .value=${this.graphNode.node.delayTime.value.toFixed(4).toString()}
                    .min=${0}
                    .max=${10}
                    .step=${0.01}
                    .unit=${"delay"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("delayTime", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
                <range-slider-view
                    .value=${this.graphNode.gainNode.gain.value.toFixed(2).toString()}
                    .min=${0}
                    .max=${1}
                    .step=${0.001}
                    .unit=${"gain"}
                    .handleInput=${(event: Event) => {
                        this.updateNode(this.graphNode.updateState("gain", (event.target as HTMLInputElement).valueAsNumber));
                    }}
                ></range-slider-view>
            </div>
            <div class="button-container">
                <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            </div>
            <div class="io-jack-container">
                <!-- IN -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"in"}
                    .isConnected=${false}
                ></input-output-jack-view>
                <!-- DELAY MODULATION -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"mod"}
                    .isConnected=${this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`)}
                ></input-output-jack-view>
                <!-- OUT -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"out"}
                    .isConnected=${false}
                ></input-output-jack-view>
            </div>
        </div>`;
    }
}
