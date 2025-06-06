import { css } from "lit";

export const audioGraphStyles = css`
    :host {
        display: flex;
        width: 80vw;
        height: 80vh;
        justify-content: center;
        align-items: center;
        background-color: var(--elevation-1);
    }

    .audio-graph-container {
        display: flex;
        justify-content: space-evenly;
        gap: calc(2 * var(--base-spacing));
        padding: calc(2 * var(--base-spacing));
        width: 60vw;
        height: 70vh;
        overflow: hidden;
        margin: auto;
        background-color: var(--elevation-2);
        border: 1px solid var(--accent-0);
        border-radius: 8px;
    }

    .nodes-container {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--base-spacing);
        padding: calc(2 * var(--base-spacing));
        background-color: var(--elevation-3);
        border: 1px solid var(--accent-0);
        border-radius: 8px;
    }

    .audio-graph-node-container {
        display: flex;
        flex-direction: column;
        gap: calc(2 * var(--base-spacing));
        width: 100%;
        height: 100%;
        overflow-y: auto;
        background-color: var(--elevation-2);
        border: 1px solid var(--text-primary);
        border-radius: 8px;
    }

    ::-webkit-scrollbar {
        display: none;
    }
`;
