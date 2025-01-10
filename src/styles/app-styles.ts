import { css } from "lit";

export const appStyles = css`
    .app {
        background-color: #222;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .controls {
        position: fixed;
        top: 0;
        left: calc(20vw + 16px);
        right: 0;
    }

    .graph {
        background-color: #222;
        border: 1px solid #444;
        border-radius: 4px;
        position: fixed;
        top: 32px;
        bottom: 16px;
        left: calc(20vw + 16px);
        right: calc(20vw + 16px);
        background-size: 40px 40px;
        background-image: linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px);
    }

    .connection-canvas {
        position: fixed;
        top: 32px;
        bottom: 16px;
        left: 16px;
        right: 16px;
    }
`;
