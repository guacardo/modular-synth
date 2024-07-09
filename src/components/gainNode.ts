export class GainNodeView extends HTMLElement {
    static observedAttributes = ["gain"];

    constructor() {
        super();
    }

    connectedCallback() {
        console.log("gain node connected");
        this.textContent = "hello world!";
    }

    attributeChangedCallback(property: string, oldValue: number, newValue: number) {
        console.log(property, oldValue, newValue);
    }
}
