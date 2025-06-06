import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { keyboardControllerStyles } from "./keyboard-controller.styles";
import { classMap } from "lit/directives/class-map.js";
import { KeyboardAudioEvent } from "../../app/util";

@customElement("keyboard-controller")
export class KeyboardController extends LitElement {
    static styles = [keyboardControllerStyles];

    events: KeyboardAudioEvent[] = [
        { key: "a", keydown: () => console.log("A key pressed") },
        { key: "s", keydown: () => console.log("S key pressed") },
        { key: "d", keydown: () => console.log("D key pressed") },
        { key: "f", keydown: () => console.log("F key pressed") },
        { key: "g", keydown: () => console.log("G key pressed") },
        { key: "h", keydown: () => console.log("H key pressed") },
        { key: "j", keydown: () => console.log("J key pressed") },
        { key: "k", keydown: () => console.log("K key pressed") },
        { key: "l", keydown: () => console.log("L key pressed") },
    ];

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

    private setKeyPressed(key: string, pressed: boolean) {
        this.events = this.events.map((event) => (event.key === key ? { ...event, pressed } : event));
        this.requestUpdate();
    }

    private handleKeyDown = (event: KeyboardEvent) => {
        const key = this.events.find((e) => e.key === event.key);
        if (key) {
            key.keydown?.();
            this.setKeyPressed(event.key, true);
        }
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        const key = this.events.find((e) => e.key === event.key);
        if (key) {
            key.keyup?.();
            this.setKeyPressed(event.key, false);
        }
    };

    render() {
        return html` <div class="keyboard-controller">
            ${this.events.map((button) => {
                return html`<button
                    class=${classMap({ "keyboard-button": true, pressed: button.pressed ?? false })}
                    @click=${button.keydown}
                >
                    ${button.key}</button
                >`;
            })}
        </div>`;
    }
}
