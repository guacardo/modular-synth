import { css } from "lit";

export const emptyNodeStyles = css`
    .empty-node-container {
        border: 1px solid #999;
        background-color: #222;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            border: 1px solid #fff;
            background-color: yellow;
        }
    }
`;
