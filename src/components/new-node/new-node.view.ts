import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";
import { Position } from "../../app/util";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @state() private currentPanel = 0;
    @state() private selectedNodeType = "";

    @property({ type: Array }) private position: Position;

    connectedCallback(): void {
        super.connectedCallback();
        console.log("connected: new-node-view", this, this.position);
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
        console.log(this, e);
    }

    private panels = (): TemplateResult[] => [
        html`<div class="panel" @click=${this.moveToNextPanel}>+</div>`,
        html`<div class="panel">
            <h6>Node Type</h6>
            <button @click=${this.moveToPrevPanel}>x</button>
            <select @change=${this.handleNodeChange} class="node-select-type">
                <option value="" disabled selected>Select Node Type</option>
                <option value="oscillator">Oscillator</option>
                <option value="gain">Gain</option>
                <option value="biquad-filter">Biquad Filter</option>
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
