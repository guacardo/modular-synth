import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("local-storage-view")
export class LocalStorageView extends LitElement {
    render() {
        return html`
            <div>
                <h1>Local Storage</h1>
                <p>Check the console for local storage data.</p>
            </div>
        `;
    }
}
