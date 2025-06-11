import { css } from "lit";

export const willysRackShackStyles = css`
    .willys-rack-shack-container {
        background-color: var(--elevation-1);
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(5, 1fr);
        width: 1280px;
        height: 800px;
        overflow: hidden;
        position: relative;
        border: 1px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`;
