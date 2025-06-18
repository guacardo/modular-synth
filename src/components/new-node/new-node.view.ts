import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";
import { AUDIO_DESTINATION_NODES, AUDIO_PROCESSOR_NODES, AUDIO_SOURCE_NODES, AudioGraphNode, AudioNodeType, Position } from "../../app/util";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: Array }) position: Position;
    @property() addNode: (type: AudioNodeType, position: Position) => void;

    @state() private currentPanel = 0;
    @state() private selectedNodeType?: AudioNodeType;

    connectedCallback(): void {
        super.connectedCallback();
    }

    private moveToNextPanel() {
        if (this.currentPanel + 1 < this.panels().length) {
            this.currentPanel = this.currentPanel + 1;
        }
    }

    private moveToPrevPanel() {
        if (this.currentPanel > 0) {
            this.currentPanel = this.currentPanel - 1;
        }
    }

    private handleNodeChange(e: Event) {
        const selectElement = e.target as HTMLSelectElement;
        this.addNode((e.target as HTMLSelectElement).value as AudioNodeType, this.position);
        selectElement.selectedIndex = 0;
        this.currentPanel = 0;
    }

    private panels = (): TemplateResult[] => [
        html`<div class="panel empty-node-container" @click=${this.moveToNextPanel}><button>+ add</button></div>`,
        html`<div class="panel">
            <select @change=${this.handleNodeChange} class="custom-select">
                <option value="" disabled selected>select node type</option>
                <optgroup label="sources">
                    ${AUDIO_SOURCE_NODES.map((option) => {
                        return html`<option value=${option} ?selected=${this.selectedNodeType === option}>${option}</option>`;
                    })}
                </optgroup>
                <optgroup label="processors">
                    ${AUDIO_PROCESSOR_NODES.map((option) => {
                        return html`<option value=${option} ?selected=${this.selectedNodeType === option}>${option}</option>`;
                    })}
                </optgroup>
                <optgroup label="destinations">
                    ${AUDIO_DESTINATION_NODES.map((option) => {
                        return html`<option value=${option} ?selected=${this.selectedNodeType === option}>${option}</option>`;
                    })}
                </optgroup>
            </select>
        </div>`,
    ];

    render() {
        return html`<div class="new-node-container">
            <div class="panel-content" style="transform: translateX(-${this.currentPanel * 100}%);">${this.panels()}</div>
        </div>`;
    }
}
