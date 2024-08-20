import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../app/audio-graph";
import { DragController } from "../controllers/drag-controller";
import { styleMap } from "lit/directives/style-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";

export interface GainChangeDetail {
    node: GraphNode | undefined;
    gain: number;
}

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    static styles = [graphNodeStyles];

    @property({ attribute: false })
    node?: GraphNode;

    @property({ type: Boolean })
    isSourceNode: boolean = false;

    @property({ type: Object })
    destination?: AudioDestinationNode;

    @state()
    connectedToContext: boolean = false;

    private dragController = new DragController(this);

    private _dispatchClick() {
        const node = this.node;
        // todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
    }

    private _dispatchGainChange(e: Event) {
        const gainChange: GainChangeDetail = {
            node: this.node,
            gain: Number((e.target as HTMLInputElement).value),
        };
        // todo, strongly type the custom event https://github.com/lit/lit-element/issues/808
        this.dispatchEvent(new CustomEvent("gain-changed", { detail: { gainChange }, bubbles: true, composed: true }));
    }

    private _connectContextHandler() {
        if (this.destination !== undefined) {
            this.node?.audioNode.connect(this.destination);
            this.connectedToContext = true;
        }
    }

    render() {
        return html`<div
            id=${ifDefined(this.node?.id)}
            class=${classMap({ node: true, connectedContext: this.connectedToContext})}
            @click=${this._dispatchClick}
            @drag=${(e: DragEvent) => this.dragController.onDrag(e)}
            @dragstart=${(e: DragEvent) => this.dragController.onDragStart(e)}
            draggable="true"
            style=${styleMap(this.dragController.styles)}
        >
            <p>${this.node?.id}</p>
            <input
                type="range"
                min="0.001"
                max="1.0"
                step="0.001"
                @input=${this._dispatchGainChange}
                draggable="true"
                @dragstart=${(e: DragEvent) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            />
            ${this.connectedToContext ? html`<p>connected</p>` : html`<button @click=${this._connectContextHandler}>connect</button>`}
        </div>`;
    }
}
