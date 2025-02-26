import { css } from "lit";

export const audioGridStyles = css`
    .grid {
        display: grid;
        border: 1px solid white;
        position: fixed;
        top: 16px;
        bottom: 16px;
        left: calc(20vw + 16px);
        right: calc(20vw + 16px);
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
    }
`;
