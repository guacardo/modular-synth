import { css } from "lit";

export const graphNodeStyles = css`
    .node {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 8px 16px;
        background-color: #333;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
    }

    .source {
        border: 1px solid #98fb98;
    }

    .connectedContext {
        border: 1px solid red;
    }
`;
