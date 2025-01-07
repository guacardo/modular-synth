import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { graphNodeStyles } from "../styles/graph-node-styles";
import { GraphNode } from "../app/audio-graph";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";

export interface GainChangeDetail {
    node: GraphNode | undefined;
    gain: number;
}

@customElement("gain-node-view")
export class GainNodeView extends LitElement {
    @property({ attribute: false }) node?: GraphNode;
    @property({ type: Object }) destination?: AudioDestinationNode;
    @state() connectedToContext: boolean = false;

    static styles = [graphNodeStyles];

    private _dispatchClick() {
        const node = this.node;
        this.dispatchEvent(new CustomEvent("node-clicked", { detail: { node }, bubbles: true, composed: true }));
    }

    private _dispatchGainChange(e: Event) {
        const gainChange: GainChangeDetail = {
            node: this.node,
            gain: Number((e.target as HTMLInputElement).value),
        };
        this.dispatchEvent(new CustomEvent("gain-changed", { detail: { gainChange }, bubbles: true, composed: true }));
    }

    render() {
        return html`<div
            id=${ifDefined(this.node?.id)}
            class=${classMap({ node: true, connectedContext: this.connectedToContext })}
            @click=${this._dispatchClick}
        >
            <p>${this.node?.id}</p>
            <input type="range" min="0.001" max="1.0" step="0.001" @input=${this._dispatchGainChange} />
        </div>`;
    }
}
