import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./input-output-jack.styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, ConnectionComponents, IOLabel } from "../../app/util";

@customElement("input-output-jack-view")
export class InputOutputJackView extends LitElement {
    static styles = [styles];

    @property({ attribute: false, type: String }) label: IOLabel;
    @property({ attribute: false, type: Boolean }) isConnectionSource = false;
    @property({ attribute: false, type: Boolean }) isConnected = false;
    @property({ attribute: false, type: Boolean }) canConnect = false;
    @property({ attribute: false, type: Object }) graphNode: AudioGraphNode;
    @property({ attribute: false }) updatePendingConnectionState: (components: ConnectionComponents) => void;

    render() {
        return html`
            <div class="io-container">
                <button
                    id=${`${this.graphNode.id.join("-")}-${this.label}`}
                    type="button"
                    class=${classMap({
                        "io-button": true,
                        "can-connect": this.canConnect,
                        "connection-source": this.isConnectionSource,
                        connected: this.isConnected,
                    })}
                    @click=${() => this.updatePendingConnectionState([...this.graphNode.id, this.label])}
                ></button>
                <label class="io-label">${this.label}</label>
            </div>
        `;
    }
}
