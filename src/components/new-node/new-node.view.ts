import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";
import { AddNodeHandler, BiquadFilterNodeWithId, GainNodeWithId, OscillatorNodeWithId } from "../../app/util";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @state() private currentPanel = 0;
    @state() private selectedNodeType = "";

    @property({ type: Array }) private position: [number, number];
    @property() private handleAddNode: AddNodeHandler;

    private handleNext() {
        if (this.currentPanel + 1 < this.panels().length) {
            this.currentPanel = this.currentPanel + 1;
        }
    }

    private handlePrev() {
        if (this.currentPanel > 0) {
            this.currentPanel = this.currentPanel - 1;
        }
    }

    private handleReset() {
        this.currentPanel = 0;
        this.selectedNodeType = "";
    }

    private handleNodeChange(e: Event) {
        this.selectedNodeType = (e.target as HTMLSelectElement).value;
        switch (this.selectedNodeType) {
            case "oscillator":
                this.handleAddNode(OscillatorNodeWithId, this.position);
                break;
            case "gain":
                this.handleAddNode(GainNodeWithId, this.position);
                break;
            case "biquad-filter":
                this.handleAddNode(BiquadFilterNodeWithId, this.position);
                break;
            default:
                throw new Error("Unknown node type");
        }

        this.handleReset();
    }

    private panels = (): TemplateResult[] => [
        html`<div class="panel" @click=${this.handleNext}>ADD +</div>`,
        html`<div class="panel">
            <h6>Node Type</h6>
            <button @click=${this.handlePrev}>x</button>
            <select @change=${this.handleNodeChange}>
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
