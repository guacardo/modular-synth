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
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        grid-template-rows: repeat(auto-fill, minmax(150px, 1fr));
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
