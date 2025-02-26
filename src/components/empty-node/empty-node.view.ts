import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

export type Position = [number, number];

@customElement("empty-node-view")
export class EmptyNodeView extends LitElement {
    @property({ type: Array }) private position: [number, number];
    @property() handleSwapToNewNodeView: (position: Position) => void;

    render() {
        return html`<div @click=${() => this.handleSwapToNewNodeView(this.position)}>Empty Node</div>`;
    }
}
