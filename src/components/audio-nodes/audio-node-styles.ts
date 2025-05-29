import { css } from "lit";

export const audioNodeStyles = css`
    .node {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 16px;
        background-color: #555;
        cursor: pointer;
    }

    .slider-container {
        width: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .isConnectSource {
        border: 1px solid #f00;
    }
`;
