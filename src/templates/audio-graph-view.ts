export class AudioGraphView extends HTMLElement {
    static get observedAttributes() {
        return ["nodes"];
    }

    constructor() {
        console.log("constructor");
        super();
    }

    connectedCallback() {
        console.log("template connected");
    }

    attributeChangedCallback(property: string, oldValue: number, newValue: number) {
        console.log(property, oldValue, newValue);
    }
}
