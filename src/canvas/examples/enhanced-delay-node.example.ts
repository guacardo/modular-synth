import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { canvasNode, canvasIO } from "../canvas-directives";

// This is an example of how to enhance your existing DelayNodeView
// You would apply these patterns to your actual delay-node.view.ts

@customElement("enhanced-delay-node-view")
export class EnhancedDelayNodeView extends LitElement {
    // ... your existing properties and methods ...
    @property({ type: Object, attribute: false }) graphNode: any; // Replace with actual type
    @property({ type: Array }) connections: Array<[string, string]> = [];
    @property({ attribute: false }) updateNode: (node: any) => void = () => {};
    @property({ attribute: false }) removeNode: (node: any) => void = () => {};
    @property({ attribute: false, type: Object }) nodeConnectState: any;
    @property({ attribute: false }) updateNodeConnectState: (node: any, param?: AudioParam, paramName?: string) => void = () => {};
    @property({ attribute: false }) onSelectAudioGraphNode: (node: any) => void = () => {};

    private isConnectionCandidate(): boolean {
        if (this.nodeConnectState?.source?.node?.numberOfOutputs && this.nodeConnectState.source.id !== this.graphNode.id) {
            return true;
        }
        return false;
    }

    private updateDelayTime(value: number) {
        // Your existing implementation
        console.log("Update delay time:", value);
    }

    render() {
        const isConnectSource = this.graphNode.id === this.nodeConnectState?.source?.id;
        const isConnectedOut = this.connections.some((connection) => connection[0] === this.graphNode.id);
        const isConnectedIn = this.connections.some((connection) => connection[1] === this.graphNode.id);

        return html`
            <!-- Enhanced with canvas node directive -->
            <div class="node" ${canvasNode(this.graphNode.id, "delay")}>
                <h2>delay</h2>
                <div class="slider-container">
                    <label for="delay-slider-${this.graphNode.id}"> delay time: ${this.graphNode.node?.delayTime?.value?.toFixed(2) || "0.00"}s </label>
                    <input
                        type="range"
                        class="slider"
                        min="0"
                        max="10"
                        step="0.01"
                        .value="${this.graphNode.node?.delayTime?.value?.toFixed(2) || "0.00"}"
                        @input=${(e: Event) => this.updateDelayTime((e.target as HTMLInputElement).valueAsNumber)}
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
                    <!-- INPUT - Enhanced with canvas IO directive -->
                    <div class="io-container">
                        <button
                            type="button"
                            class=${classMap({
                                "io-button": true,
                                "can-connect": this.isConnectionCandidate(),
                                connected: isConnectedIn,
                            })}
                            ${canvasIO(this.graphNode.id, "input")}
                            @click=${() => this.updateNodeConnectState(this.graphNode)}
                        ></button>
                        <label class="io-label">in</label>
                    </div>

                    <!-- DELAY MODULATION - Enhanced with parameter-specific directive -->
                    <div class="io-container">
                        <button
                            type="button"
                            class=${classMap({
                                "io-button": true,
                                "can-connection": this.isConnectionCandidate(),
                                connected: this.connections.some((connection) => connection[1] === `${this.graphNode.id}-delayTime`),
                            })}
                            ${canvasIO(this.graphNode.id, "param", "delayTime")}
                            @click=${() => this.updateNodeConnectState(this.graphNode, this.graphNode.node?.delayTime, "delayTime")}
                        ></button>
                        <label class="io-label">delay mod</label>
                    </div>

                    <!-- OUTPUT - Enhanced with canvas IO directive -->
                    <div class="io-container">
                        <button
                            type="button"
                            class=${classMap({
                                "io-button": true,
                                "connection-source": isConnectSource,
                                connected: isConnectedOut,
                            })}
                            ${canvasIO(this.graphNode.id, "output")}
                            @click=${() => this.updateNodeConnectState(this.graphNode)}
                        ></button>
                        <label class="io-label">out</label>
                    </div>
                </div>
            </div>
        `;
    }
}
