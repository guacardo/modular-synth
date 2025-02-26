import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Position } from "../../app/util";
import { emptyNodeStyles } from "./empty-node.styles";

@customElement("empty-node-view")
export class EmptyNodeView extends LitElement {
    static styles = [emptyNodeStyles];

    @property({ type: Array }) private position: [number, number];
    @property() handleSwapToNewNodeView: (position: Position) => void;

    render() {
        return html`<div class="empty-node-container" @click=${() => this.handleSwapToNewNodeView(this.position)}>
            <div class="content">+</div>
        </div>`;
    }
}
