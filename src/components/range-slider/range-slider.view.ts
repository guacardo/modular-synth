import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./range-slider.styles";

@customElement("range-slider-view")
export class RangeSliderView extends LitElement {
    static styles = [styles];

    @property({ type: String }) value = "";
    @property({ type: Number }) min = 0;
    @property({ type: Number }) max = 100;
    @property({ type: Number }) step = 1;
    @property({ type: String }) unit = "";
    @property({ attribute: false }) handleInput: (event: Event) => void;

    render() {
        return html`
            <div class="slider-container">
                <input
                    class="slider"
                    type="range"
                    min="${this.min}"
                    max="${this.max}"
                    step="${this.step}"
                    .value="${this.value}"
                    @input="${this.handleInput}"
                />
                <label class="label">
                    <span class="unit">${this.unit}</span>
                    <span class="value">${this.value}</span>
                </label>
            </div>
        `;
    }
}
