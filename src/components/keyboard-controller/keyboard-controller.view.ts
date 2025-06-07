import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { keyboardControllerStyles } from "./keyboard-controller.styles";
import { classMap } from "lit/directives/class-map.js";
import { KeyboardAudioEvent } from "../../app/util";

@customElement("keyboard-controller")
export class KeyboardController extends LitElement {
    static styles = [keyboardControllerStyles];

    @property({ attribute: false }) keyboardAudioEvents: Map<string, KeyboardAudioEvent[]>;

    pressedKeys: Set<string> = new Set();

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        this.keyboardAudioEvents.get(event.key)?.map((button) => {
            button.keydown();
        });
        this.pressedKeys.add(event.key);
        this.requestUpdate();
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.keyboardAudioEvents.get(event.key)?.map((button) => {
            button.keyup?.();
        });
        this.pressedKeys.delete(event.key);
        this.requestUpdate();
    };

    render() {
        return html` <div class="keyboard-controller">
            ${Array.from(this.keyboardAudioEvents.entries()).map(
                ([key, _]) => html`
                    <button class=${classMap({ "keyboard-button": true, pressed: this.pressedKeys.has(key) ?? false })}> ${key} </button>
                `
            )}
        </div>`;
    }
}
