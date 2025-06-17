import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localStorageStyles } from "./local-storage.styles";
import { AudioGraphNode } from "../../app/util";

@customElement("local-storage-view")
export class LocalStorageView extends LitElement {
    styles = [localStorageStyles];

    @state() keyName: string = "";
    @property({ type: Array }) audioGraph: AudioGraphNode[] = [];
    @property({ type: Array }) connections: Array<[string, string]> = [];

    save = () => {
        const serializedGraph = JSON.stringify(this.audioGraph);
        const serializedConnections = JSON.stringify(this.connections);
        console.log("Saving to local storage", serializedGraph, serializedConnections);
        localStorage.setItem(this.keyName, JSON.stringify({ graph: serializedGraph, connections: serializedConnections }));
    };

    load = () => {
        // const deserializedGraph = JSON.parse(serializedGraph);
        // const deserializedConnections = JSON.parse(serializedConnections);
        // console.log("Deserialized graph", deserializedGraph, "Connections", deserializedConnections);
    };

    render() {
        const keys = Object.keys(localStorage);
        console.log("Local Storage Keys:", keys);
        return html`
            <div class="container">
                <label for="keyName">${this.keyName}</label>
                <input
                    id="keyName"
                    type="text"
                    .value="${this.keyName}"
                    placeholder="synth name"
                    @input="${(e: Event) => (this.keyName = (e.target as HTMLInputElement).value)}"
                />
                <button type="button" class="button" @click=${this.save}>Save</button>
                <button type="button" class="button" @click=${this.load}>Load</button>
            </div>
        `;
    }
}
