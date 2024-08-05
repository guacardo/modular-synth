import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { AudioGraphView } from "./components/audio-graph-view";

import "./components/audio-graph-view";

@customElement("app-view")
export class AppView extends LitElement {
    render() {
        return html` <audio-graph-view></audio-graph-view> `;
    }
}

declare global {
    interface Window {
        // DOM_EVENTS: DomEvents;
    }
    interface HTMLElementTagNameMap {
        "app-view": AppView;
        "audio-graph-view": AudioGraphView;
    }
}
// window.DOM_EVENTS = new DomEvents();
