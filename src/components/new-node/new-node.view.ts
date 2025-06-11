import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";
import { AudioGraphNode, AudioNodeType, Position } from "../../app/util";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @property({ type: Array }) audioGraph: AudioGraphNode[];
    @property({ type: Array }) position: Position;
    @property({ type: Array }) options: AudioNodeType[];
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
        html`<div class="panel empty-node-container" @click=${this.moveToNextPanel}><button>+</button></div>`,
        html`<div class="panel">
            <h6>Node Type</h6>
            <button @click=${this.moveToPrevPanel}>x</button>
            <select @change=${this.handleNodeChange} class="node-select-type">
                <option value="" disabled selected>Select Node Type</option>
                ${this.options.map((option) => {
                    return html`<option value=${option} ?selected=${this.selectedNodeType === option}>${option}</option>`;
                })}
            </select>
        </div>`,
    ];

    render() {
        return html`<div class="new-node-container">
            <div class="panel-content" style="transform: translateX(-${this.currentPanel * 100}%);">${this.panels()}</div>
        </div>`;
    }
}
