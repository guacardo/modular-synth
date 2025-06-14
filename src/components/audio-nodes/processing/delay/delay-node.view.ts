import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DelayGraphNode } from "./delay-graph-node";
import { AudioDestinationGraphNode, AudioGraphNode, AudioParamName, NodeConnectState, updateAudioParamValue } from "../../../../app/util";
import { audioNodeStyles } from "../../audio-node-styles";

@customElement("delay-node-view")
export class DelayNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ type: Object, attribute: false }) graphNode: DelayGraphNode;
    @property({ type: Array }) connections: Array<[string, string]>;
    @property({ attribute: false }) updateNode: (node: AudioGraphNode) => void;
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
            <div class="button-io-container">
                <!-- IN -->
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "can-connect": this.isConnectionCandidate(),
                            connected: isConnectedIn,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">in</label>
                </div>
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
                <div class="io-container">
                    <button
                        type="button"
                        class=${classMap({
                            "io-button": true,
                            "connection-source": isConnectSource,
                            connected: isConnectedOut,
                        })}
                        @click=${() => this.updateNodeConnectState(this.graphNode)}
                    ></button>
                    <label class="io-label">out</label>
                </div>
            </div>
        </div>`;
    }
}
