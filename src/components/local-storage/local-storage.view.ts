import { html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localStorageStyles } from "./local-storage.styles";
import { AudioGraphNode } from "../../app/util";

@customElement("local-storage-view")
export class LocalStorageView extends LitElement {
    static styles = [localStorageStyles];

    @state() keyName: string = "";
    @property({ type: Array }) audioGraph: AudioGraphNode[] = [];
    @property({ type: Array }) connections: Array<[string, string]> = [];
    @property({ attribute: false }) loadAudioGraph: (audioGraph: AudioGraphNode[], connections: Array<[string, string]>) => void;
    @property({ attribute: false }) clearAudioGraph: () => void;

    save = () => {
        const serializedGraph = JSON.stringify(this.audioGraph);
        const serializedConnections = JSON.stringify(this.connections);
        localStorage.setItem(this.keyName, JSON.stringify({ graph: serializedGraph, connections: serializedConnections }));
    };

    load = (key: string) => {
        interface StorageData {
            graph: AudioGraphNode[];
            connections: Array<[string, string]>;
        }
        const raw = localStorage.getItem(key);
        let data: StorageData = { graph: [], connections: [] };
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                data.graph = typeof parsed.graph === "string" ? JSON.parse(parsed.graph) : parsed.graph ?? [];
                data.connections = typeof parsed.connections === "string" ? JSON.parse(parsed.connections) : parsed.connections ?? [];
            } catch (e) {
                console.error("Failed to parse localStorage data", e);
            }
        }
        this.loadAudioGraph(data.graph, data.connections);
    };

    render() {
        const keys = Object.keys(localStorage);
        return html`
            <div class="container">
                <input
                    id="keyName"
                    type="text"
                    .value="${this.keyName}"
                    placeholder="synth name"
                    @input="${(e: Event) => (this.keyName = (e.target as HTMLInputElement).value)}"
                />
                <button type="button" class="button" @click=${this.save}>Save</button>
                <button type="button" class="button" @click=${this.clearAudioGraph}>Clear</button>
                <select class="custom-select" @change="${(e: Event) => this.load((e.target as HTMLSelectElement).value)}">
                    <option disabled selected value="">-- Select a synth --</option>
                    ${keys.map((key) => html`<option value="${key}" ?selected=${this.keyName === key}>${key}</option>`)}
                </select>
            </div>
        `;
    }
}
