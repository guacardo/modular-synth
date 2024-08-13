import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../model/audio-graph";

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

    private _dispatchClick() {
        const node = this.node;
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
    }

    private _dispatchGainChange(e: Event) {
        e.stopPropagation();
        const gainChange: GainChangeDetail = {
            node: this.node,
            gain: Number((e.target as HTMLInputElement).value),
        };
        this.dispatchEvent(new CustomEvent("gain-changed", { detail: { gainChange }, bubbles: true, composed: true }));
    }

    private _connectContextHandler(e: Event) {
        e.stopPropagation();
        if (this.destination !== undefined) {
            this.node?.audioNode.connect(this.destination);
        }
    }

    render() {
        return html`<div class="node" @click=${this._dispatchClick}>
            <p>${this.node?.id}</p>
            <input type="range" min="0.001" max="1.0" step="0.001" @input=${this._dispatchGainChange} />
            <button @click=${this._connectContextHandler}>connect</button>
        </div>`;
    }
}
