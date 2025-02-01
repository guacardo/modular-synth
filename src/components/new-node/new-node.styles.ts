import { css } from "lit";

export const newNodeStyles = css`
    .new-node-container {
        width: 150px;
        height: 100px;
        border: 1px solid #999;
        background-color: #222;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &:hover {
            border: 1px solid #fff;
            background-color: #333;
        }

        .panel-content {
            display: flex;
            flex-direction: row;
            transform: translateX(0);
            transition: transform 0.3s ease-in;
            width: 100%;
            height: 100%;
        }

        .panel {
            min-width: 100%;
            height: 100%;
            flex-shrink: 0;
        }
    }
`;
