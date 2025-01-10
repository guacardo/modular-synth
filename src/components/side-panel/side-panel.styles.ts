import { css } from "lit";

export const sidePanelStyles = css`
    .side-panel-container {
        position: fixed;
        top: 0;
        height: 100vh;
        width: 20vw;
        background-color: #333;
        overflow-y: scroll;
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }
`;
