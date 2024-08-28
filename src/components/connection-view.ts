import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { DomSpace } from "../app/dom-mediator";
import { styleMap } from "lit/directives/style-map.js";

interface ConnectionStyles extends Record<string, any> {
    top?: string;
    left?: string;
    width?: string;
    height?: string;
    position?: string;
    background?: string;
}

@customElement("connection-view")
export class ConnectionView extends LitElement {
    @property({ type: Object })
    source?: DomSpace;

    @property({ type: Object })
    dest?: DomSpace;

    private styles(): any {
        let styles: ConnectionStyles = { position: "absolute", background: "red" };
        if (this.source !== undefined && this.dest !== undefined) {
            // source is above destination
            if (this.source.position.y <= this.dest.position.y) {
                styles.top = `${this.source.position.y - 32}px`;
                styles.height = `${this.dest.position.y - (this.source.position.y - this.source.offset.y)}px`;
            }
            // source is below destination
            if (this.source.position.y > this.dest.position.y) {
                styles.top = `${this.dest.position.y - 32}px`;
                styles.height = `${this.source.position.y + this.source.offset.y - this.dest.position.y}px`;
            }

            // source is to the left of destination
            if (this.source.position.x < this.dest.position.x) {
                styles.left = `${this.source.position.x + this.source.offset.x - 16}px`;
                styles.width = `${this.dest.position.x - (this.source.position.x + this.source.offset.x)}px`;
            }

            // source is to the right of destination
            if (this.source.position.x + this.source.offset.x > this.dest.position.x) {
                styles.left = `${this.dest.position.x - 16}px`;
                styles.width = `${this.source.position.x + this.source.offset.x - this.dest.position.x}px`;
            }
        }
        return styles;
    }

    render() {
        return html` <div style=${styleMap(this.styles())}></div>`;
    }
}
