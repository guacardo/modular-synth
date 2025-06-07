import { html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { keyboardControllerStyles } from "./keyboard-controller.styles";
import { classMap } from "lit/directives/class-map.js";
import { KeyboardAudioEvent } from "../../app/util";

@customElement("keyboard-controller")
export class KeyboardController extends LitElement {
    static styles = [keyboardControllerStyles];

    events: Map<string, KeyboardAudioEvent[]> = new Map([
        ["a", [{ keydown: () => console.log("A pressed 1st") }, { keydown: () => console.log("A pressed 2nd") }]],
        ["s", [{ keydown: () => console.log("S pressed") }]],
        ["d", [{ keydown: () => console.log("D pressed") }]],
        ["f", [{ keydown: () => console.log("F pressed") }]],
        ["g", [{ keydown: () => console.log("G pressed") }]],
        ["h", [{ keydown: () => console.log("H pressed") }]],
        ["j", [{ keydown: () => console.log("J pressed") }]],
        ["k", [{ keydown: () => console.log("K pressed") }]],
    ]);

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
        this.events.get(event.key)?.map((button) => {
            button.keydown();
        });
        this.pressedKeys.add(event.key);
        this.requestUpdate();
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.events.get(event.key)?.map((button) => {
            button.keyup?.();
        });
        this.pressedKeys.delete(event.key);
        this.requestUpdate();
    };

    render() {
        return html` <div class="keyboard-controller">
            ${Array.from(this.events.entries()).map(
                ([key, _]) => html`
                    <button class=${classMap({ "keyboard-button": true, pressed: this.pressedKeys.has(key) ?? false })}> ${key} </button>
                `
            )}
        </div>`;
    }
}
