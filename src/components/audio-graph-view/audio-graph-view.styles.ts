import { css } from "lit";

export const audioGraphStyles = css`
    :host {
        display: flex;
        width: 80vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: var(--elevation-1);
    }

    .audio-graph-container {
        display: flex;
        flex-direction: row;
        gap: calc(2 * var(--base-spacing));
        padding: calc(2 * var(--base-spacing));
        width: 60vw;
        height: 70vh;
        overflow: hidden;
        margin: auto;
        background-color: var(--elevation-2);
        border: 1px solid var(--border-0);
    }

    .nodes-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: var(--elevation-3);
        border: 1px solid var(--border-0);
        padding: calc(2 * var(--base-spacing));
    }
`;
