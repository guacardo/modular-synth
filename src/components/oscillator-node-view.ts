import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../model/audio-graph";
import { classMap } from "lit/directives/class-map.js";
import { DragController } from "../controllers/drag-controller";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

export interface FrequencyChangeDetail {
    node: GraphNode | undefined;
    frequency: number;
}

export interface OscillatorTypeChangeDetail {
    node: GraphNode | undefined;
    type: OscillatorType;
}

// export higher up? types file?
const settableOscillatorTypes: readonly OscillatorType[] = ["sawtooth", "sine", "square", "triangle"] as const;

@customElement("oscillator-node-view")
export class OscillatorNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ attribute: false })
    node?: GraphNode;

    @property({ type: Boolean })
    isSourceNode: boolean = false;

    private dragController = new DragController(this);

    private _dispatchClick() {
        const node = this.node;
        // todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, composed: true }));
    }

    private _dispatchFrequencyChange(e: Event) {
        const frequencyChange: FrequencyChangeDetail = {
            node: this.node,
            frequency: Number((e.target as HTMLInputElement).value),
        };
        // todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
        this.dispatchEvent(new CustomEvent("frequency-change", { detail: { frequencyChange }, composed: true }));
    }

    private _dispatchTypeChange(e: Event) {
        const typeChange: OscillatorTypeChangeDetail = {
            node: this.node,
            type: (e.target as HTMLSelectElement).value as OscillatorType,
        };

        this.dispatchEvent(new CustomEvent("type-change", { detail: { typeChange }, composed: true }));
    }

    render() {
        return html`<div
            id=${ifDefined(this.node?.id)}
            class="${classMap({ node: true, source: this.isSourceNode })}"
            @click=${this._dispatchClick}
            @drag=${(e: DragEvent) => this.dragController.onDrag(e)}
            @dragstart=${(e: DragEvent) => this.dragController.onDragStart(e)}
            draggable="true"
            style=${styleMap(this.dragController.styles)}
        >
            <p>${this.node?.id}</p>
            <input type="range" min="0" max="2000" @input=${this._dispatchFrequencyChange} @click=${(e: Event) => e.stopPropagation()} />
            <select @change=${this._dispatchTypeChange} @click=${(e: Event) => e.stopPropagation()}>
                ${settableOscillatorTypes.map((type) => {
                    return html`<option
                        value=${type}
                        ?selected=${type === ((this.node?.audioNode as OscillatorNode).type as OscillatorType)}
                        >${type}</option
                    >`;
                })}
            </select>
        </div>`;
    }
}
