import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { audioNodeStyles } from "../../audio-node-styles";
import { AudioGraphNode, ConnectionComponents } from "../../../../app/util";
import { MicrophoneGraphNode } from "./microphone-graph-node";
import { classMap } from "lit/directives/class-map.js";

@customElement("microphone-node-view")
export class MicrophoneNodeView extends LitElement {
    static styles = [audioNodeStyles];

    @property({ attribute: false, type: Object }) readonly graphNode: MicrophoneGraphNode;
    @property({ attribute: false, type: Array }) readonly connections: Array<[string, string]>;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (connection: ConnectionComponents) => void;

    private async handleMicrophonePermission() {
        try {
            await this.graphNode.initializeMicrophone();
            this.requestUpdate();
        } catch (error) {
            console.error("Failed to initialize microphone:", error);
        }
    }

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
            <div class="button-container">
                ${!this.graphNode.state.hasPermission
                    ? html`<button class="button" type="button" @click=${this.handleMicrophonePermission}> Enable Microphone </button>`
                    : html`<button
                          class=${classMap({
                              button: true,
                              "button-active": this.graphNode.state.isRecording,
                          })}
                          type="button"
                          @click=${() => this.updateNode(this.graphNode.updateState("isRecording", !this.graphNode.state.isRecording))}
                      >
                          ${this.graphNode.state.isRecording ? "Recording" : "Stopped"}
                      </button>`}
                <button
                    class=${classMap({ button: true, "button-active": this.graphNode.state.isSelected })}
                    type="button"
                    @click=${() => this.updateNode(this.graphNode.updateState("isSelected", !this.graphNode.state.isSelected))}
                >
                    keyboard
                </button>
                <button class="button" type="button" @click=${() => this.removeNode(this.graphNode)}>x</button>
            </div>
            <div class="io-jack-container">
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
