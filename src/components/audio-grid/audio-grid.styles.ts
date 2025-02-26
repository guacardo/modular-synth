import { css } from "lit";

export const audioGridStyles = css`
    .grid {
        display: grid;
        position: fixed;
        top: 16px;
        bottom: 16px;
        left: calc(20vw + 16px);
        right: calc(20vw + 16px);
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(10, 1fr);
        grid-auto-flow: column;
        gap: 8px;
    }

    .row {
        display: flex;
        flex-direction: row;
        grid-column: 1 / -1;
        gap: 8px;
    }
`;
