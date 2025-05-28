import { css } from "lit";

export const audioGraphStyles = css`
    :host {
        display: flex;
        width: 80vw;
        height: 100vh;
        justify-content: center;
        align-items: center;
        background-color: #222;
    }

    .audio-graph-container {
        display: flex;
        flex-direction: row;
        width: 60vw;
        height: 70vh;
        background-color: #333;
        overflow: hidden;
        border: 1px solid #aaa;
        margin: auto;
    }

    .nodes-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: 1px solid #aaa;
        margin: 10px;
        padding: 10px;
    }
`;
