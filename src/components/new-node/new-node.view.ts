import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { newNodeStyles } from "./new-node.styles";

@customElement("new-node-view")
export class NewNodeView extends LitElement {
    static styles = [newNodeStyles];

    render() {
        html`<div class="container">ADD +</div>`;
    }
}