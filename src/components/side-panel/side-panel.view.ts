import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, AudioNodeType, ConnectionComponents, Position } from "../../app/util";

type Orientation = "left" | "right";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: String, attribute: true }) readonly orientation: Orientation;
    @property({ attribute: false, type: Array }) readonly audioGraph: AudioGraphNode[];
    @property({ attribute: false, type: Array }) readonly connections: Array<[ConnectionComponents, ConnectionComponents]> = [];
    @property({ attribute: false, type: Array }) readonly pendingConnectionState: [string, string];
    @property({ attribute: false }) readonly addNode: (type: AudioNodeType, position: Position) => void;
    @property({ attribute: false }) readonly updateNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly removeNode: (node: AudioGraphNode) => void;
    @property({ attribute: false }) readonly updatePendingConnectionState: (id: string) => void;
    @property({ attribute: false }) readonly loadAudioGraph: (
        audioGraph: AudioGraphNode[],
        connections: Array<[ConnectionComponents, ConnectionComponents]>
    ) => void;
    @property({ attribute: false }) readonly clearAudioGraph: () => void;

    @state() visible: boolean = false;

    connectedCallback(): void {
        super.connectedCallback();
    }

    private toggleVisibility() {
        this.visible = !this.visible;
        console.log(this.visible);
    }

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
            visible: this.visible,
        };
        return html` <button class="side-panel-activator" @click=${this.toggleVisibility}>O</button>
            <div class="side-panel-container${classMap(classes)}">
                <button class="close-button" @click=${this.toggleVisibility}>X</button>
                <local-storage-view
                    .audioGraph=${this.audioGraph}
                    .connections=${this.connections}
                    .loadAudioGraph=${this.loadAudioGraph}
                    .clearAudioGraph=${this.clearAudioGraph}
                ></local-storage-view>
                <div class="connections-container">
                    ${this.connections.map((connection) => html`<p>Connection: ${connection[0]} -> ${connection[1]}</p>`)}
                </div>
            </div>`;
    }
}
