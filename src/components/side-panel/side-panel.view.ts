import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { sidePanelStyles } from "./side-panel.styles";
import { classMap } from "lit/directives/class-map.js";

type Orientation = "left" | "right";

@customElement("side-panel-view")
export class SidePanelView extends LitElement {
    static styles = [sidePanelStyles];

    @property({ type: String, attribute: true }) orientation: Orientation;

    connectedCallback(): void {
        super.connectedCallback();
        console.log("connected: side-panel-view", this);
    }

    render() {
        const classes = {
            left: this.orientation === "left" ? true : false,
            right: this.orientation === "right" ? true : false,
        };
        return html` <div class="side-panel-container${classMap(classes)}">
            <p>HELLO SIDE WORLD</p>
            <button @click=${() => console.log("side panel clicked")}>Click me</button>
        </div>`;
    }
}
