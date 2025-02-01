import { LitElement, TemplateResult, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    @state() private currentPanel = 0;

    @property() private handleAddNode: (nodeConstructor: new (context: AudioContext) => AudioNode) => void;

    private handleNext() {
        this.currentPanel = (this.currentPanel + 1) % this.panels.length;
    }

    private handlePrev() {
        this.currentPanel = (this.currentPanel - 1 + this.panels.length) % this.panels.length;
    }

    private handleNodeChange(e: Event) {
        const nodeType = (e.target as HTMLSelectElement).value;
        switch (nodeType) {
            case "oscillator":
                this.handleAddNode(OscillatorNode);
                break;
            case "gain":
                this.handleAddNode(GainNode);
                break;
            case "biquad-filter":
                this.handleAddNode(BiquadFilterNode);
                break;
            default:
                throw new Error("Unknown node type");
        }

        this.handleNext();
    }

    private panels: TemplateResult[] = [
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
            <p>Selected Audio Node</p>
        </div>`,
    ];

    render() {
        return html`<div class="new-node-container">
            <div class="panel-content" style="transform: translateX(-${this.currentPanel * 100}%);">${this.panels}</div>
        </div>`;
    }
}
