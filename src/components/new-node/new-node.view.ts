import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";
import { AudioGraphNode, AudioNodeType, Position } from "../../app/util";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @state() private currentPanel = 0;
    @state() private selectedNodeType = "";

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: Array }) position: Position;
    @property() addNode: (type: AudioNodeType) => void;

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
        this.addNode((e.target as HTMLSelectElement).value as AudioNodeType);
    }

    /*
        @description We must start building our audio graph with an audio source node.
        If we have an audio source node, we can add audio processing nodes.
        @returns {TemplateResult[]} An array of `<option>` of viable audio node types.
    */
    private filteredOptions(): TemplateResult[] {
        const audioSourceNodes: AudioNodeType[] = ["oscillator"];
        const audioProcessingNodes: AudioNodeType[] = ["gain", "biquad-filter"];
        let options: AudioNodeType[] = [];
        if (this.audioGraph.length) {
            options = audioProcessingNodes;
            return options.map((option) => html`<option value=${option}>${option}</option>`);
        } else {
            options = audioSourceNodes;
            return options.map((option) => html`<option value=${option}>${option}</option>`);
        }
    }

    private panels = (): TemplateResult[] => [
        html`<div class="panel" @click=${this.moveToNextPanel}><button type="button">+</button></div>`,
        html`<div class="panel">
            <h6>Node Type</h6>
            <button @click=${this.moveToPrevPanel}>x</button>
            <select @change=${this.handleNodeChange} class="node-select-type">
                <option value="" disabled selected>Select Node Type</option>
                ${this.filteredOptions()}
            </select>
        </div>`,
        html`<div class="panel">
            <p>${this.selectedNodeType}</p>
        </div>`,
    ];

    render() {
        return html`<div class="new-node-container">
            <div class="panel-content" style="transform: translateX(-${this.currentPanel * 100}%);">${this.panels()}</div>
        </div>`;
    }
}
