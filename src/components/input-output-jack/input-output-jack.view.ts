import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./input-output-jack.styles";
import { classMap } from "lit/directives/class-map.js";
import { AudioGraphNode, AudioParamName, IOLabel } from "../../app/util";

@customElement("input-output-jack-view")
export class InputOutputJackView extends LitElement {
    static styles = [styles];

    @property({ attribute: false, type: String }) label: IOLabel;
    @property({ attribute: false, type: Boolean }) isConnectionSource = false;
    @property({ attribute: false, type: Boolean }) isConnected = false;
    @property({ attribute: false, type: Boolean }) canConnect = false;
    @property({ attribute: false, type: Object }) graphNode: AudioGraphNode;
    @property({ attribute: false, type: Object }) param?: AudioParam;
    @property({ attribute: false, type: String }) paramName?: AudioParamName;
    @property({ attribute: false }) updatePendingConnectionState: (id: string) => void;

    render() {
        return html`
            <div class="io-container" id=${`${this.graphNode.id}-${this.paramName !== undefined ? this.paramName : this.label}`}>
                <button
                    type="button"
                    class=${classMap({
                        "io-button": true,
                        "can-connect": this.canConnect,
                        "connection-source": this.isConnectionSource,
                        connected: this.isConnected,
                    })}
                    @click=${() => this.updatePendingConnectionState(this.graphNode.id)}
                ></button>
                <label class="io-label">${this.label}</label>
            </div>
        `;
    }
}
