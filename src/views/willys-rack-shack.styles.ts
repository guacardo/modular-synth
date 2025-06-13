import { css } from "lit";

export const willysRackShackStyles = css`
    .willys-rack-shack-container {
        background-color: var(--elevation-1);
        width: 1280px;
        height: 800px;
        overflow: hidden;
        position: relative;
        border: 1px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        .grid {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
        }

        .grid-column {
            display: block;
            overflow-y: scroll;
            width: 20%;
            border-right: 1px solid var(--elevation-2);
        }

        .grid-column:last-child {
            border-right: none;
        }
    }
`;
