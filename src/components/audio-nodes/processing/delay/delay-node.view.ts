import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DelayGraphNode } from "./delay-graph-node";
import { AudioGraphNode, AudioParamName, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioDestinationGraphNode } from "../../destination/audio-destination-node/audio-destination-graph-node";

@customElement("delay-node-view")
export class DelayNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: DelayGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false, type: Object }) nodeConnectState: NodeConnectState;
    @property({ attribute: false }) updateNodeConnectState: (
        node: AudioGraphNode | AudioDestinationGraphNode,
        param?: AudioParam,
        paramName?: AudioParamName
    ) => void;
    @property({ attribute: false }) onSelectAudioGraphNode: (node: AudioGraphNode) => void;

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState.source?.node?.numberOfOutputs && this.nodeConnectState.source.id !== this.graphNode.id) {
            return true;
        }
        return false;
    }

    private updateDelayTime(value: number) {
        this.updateNode({
            ...this.graphNode,
            node: updateAudioParamValue(this.graphNode.node as DelayNode, { delayTime: value } as Partial<Record<keyof DelayNode, number>>),
        });
    }

    private updateGain(value: number) {
        this.graphNode.updateGain(value);
        this.updateNode({ ...this.graphNode });
    }

    render() {
        const isConnectSource = this.graphNode.id === this.nodeConnectState.source?.id;
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);
        return html`<div class="node">
            <h2>delay</h2>
            <div class="slider-container">
                <label for="delay-slider-${this.graphNode.id}">delay time: ${this.graphNode.node.delayTime.value.toFixed(2)}s</label>
                <input
                    type="range"
                    class="slider"
                    min="0"
                    max="10"
                    step="0.01"
                    .value="${this.graphNode.node.delayTime.value.toFixed(2)}"
                    @input=${(e: Event) => this.updateDelayTime((e.target as HTMLInputElement).valueAsNumber)}
                />
            </div>
            <div class="slider-container">
                <label class="label"><span class="unit">gain:</span> <span class="value">${this.graphNode.gainNode.gain.value.toFixed(3)}</span></label>
                <input
                    class="slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.001"
                    .value="${this.graphNode.gainNode.gain.value.toString()}"
                    @input=${(e: Event) => {
                        this.updateGain((e.target as HTMLInputElement).valueAsNumber);
                    }}
                />
            </div>
            <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            <button
                class=${classMap({ button: true, "button-active": this.graphNode.isSelected })}
                type="button"
                @click=${() => this.onSelectAudioGraphNode(this.graphNode)}
            >
                Select
            </button>
            <div class="button-io-container">
                <!-- IN -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updateNodeConnectState=${this.updateNodeConnectState}
                    .label=${"in"}
                    .isConnected=${isConnectedIn}
                    .canConnect=${this.isConnectionCandidate()}
                ></input-output-jack-view>
                <!-- DELAY MODULATION -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connection": this.isConnectionCandidate(),
                            connected: this.connections.some((connection) => connection[1] === `${this.graphNode.id}-delayTime`),
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode, this.graphNode.node.delayTime, "delayTime")}
                    ></button>
                    <label class="io-label">delay mod</label>
                </div>
                <!-- OUT -->
                <input-output-jack-view
                    .graphNode=${this.graphNode}
                    .updateNodeConnectState=${this.updateNodeConnectState}
                    .label=${"out"}
                    .isConnected=${isConnectedOut}
                    .isConnectionSource=${isConnectSource}
                ></input-output-jack-view>
            </div>
        </div>`;
    }
}
