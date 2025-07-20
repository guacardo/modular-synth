import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, ConnectionComponents, updateAudioParamValue } from "../../../../app/util";
import { GainGraphNode } from "./gain-graph-node";

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) graphNode: GainGraphNode;
    @property({ attribute: false, type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false, type: Array }) pendingConnectionState: [string, string];
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) updatePendingConnectionState: (connection: ConnectionComponents) => void;

    private updateGain(value: number) {
        this.updateNode({
            ...this.graphNode,
            node: updateAudioParamValue(this.graphNode.node, { gain: value } as Partial<Record<keyof GainNode, number>>),
        });
    }

    render() {
        const isGainModConnected = this.connections.some((connection) => connection[1] === `${this.graphNode.id}-gain`);

        return html`<div class="node">
            <h2 class="node-title"><span>gain</span></h2>
            <div class="sliders">
                <range-slider-view
                    .value=${(this.graphNode.node as GainNode).gain.value.toFixed(2).toString()}
                    .min=${0.001}
                    .max=${1.0}
                    .step=${0.001}
                    .unit=${"Gain"}
                    .handleInput=${(event: Event) => this.updateGain((event.target as HTMLInputElement).valueAsNumber)}
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
                <!-- GAIN MODULATION -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updatePendingConnectionState=${this.updatePendingConnectionState}
                    .label=${"mod"}
                    .isConnected=${isGainModConnected}
                    .param=${this.graphNode.node.gain}
                    .paramName=${"gain"}
                >
                </input-output-jack-view>
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
