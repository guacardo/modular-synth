import { css } from "lit";

export const audioGridStyles = css`
    .grid {
        display: grid;
        background-color: red;
        border: 1px solid yellow;
        position: fixed;
        top: 16px;
        bottom: 16px;
        left: calc(20vw + 16px);
        right: calc(20vw + 16px);
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
    }
`;
