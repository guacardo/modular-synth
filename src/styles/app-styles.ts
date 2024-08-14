import { css } from "lit";

export const appStyles = css`
    .app {
        background-color: #333;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .controls {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
    }

    .graph {
        background-color: #222;
        border: 1px solid #444;
        border-radius: 4px;
        position: fixed;
        top: 32px;
        bottom: 16px;
        left: 16px;
        right: 16px;
        background-size: 40px 40px;
        background-image: linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px);
    }
`;
