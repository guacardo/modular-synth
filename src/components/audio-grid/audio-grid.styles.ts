import { css } from "lit";

export const audioGridStyles = css`
    .grid {
        display: grid;
        background-color: red;
        border: 1px solid yellow;
        position: fixed;
        top: 50vh;
        bottom: 16px;
        left: calc(20vw + 16px);
        right: calc(20vw + 16px);
        grid-template-columns: auto;
        grid-template-rows: auto;
    }
`;
