import { html, LitElement } from "lit";
import { Connection } from "../app/audio-graph";
import { property } from "lit/decorators.js";

export class ConnectionView extends LitElement {
    @property({ type: Object })
    connection?: Connection;

    render() {
        return html` <div class="connection">${this.connection?.sourceId} : ${this.connection?.destinationId}</div>`;
    }
}
