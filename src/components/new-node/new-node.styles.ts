import { css } from "lit";

export const newNodeStyles = css`
    :host {
        flex: 1 1 0px;
        border: 1px solid white;
    }

    .new-node-container {
        cursor: pointer;
        position: relative;
        overflow: hidden;

        .panel-content {
            display: flex;
            flex-direction: row;
            transition: transform 0.3s ease-in;
            width: 100%;
            height: 100%;
        }

        .panel {
            width: 100%;
            height: 100%;
            flex-shrink: 0;
        }

        .node-select-type {
            width: 50px;
        }
    }
`;

export const emptyNodeStyles = css`
    :host {
        flex: 1 1 0px;
        cursor: pointer;
    }

    .empty-node-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        opacity: 0.2;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.5);
        transition: opacity 1s ease-in, border 1s ease-in, color 1s ease-in;

        &:hover {
            opacity: 1;
            border: 1px solid rgba(255, 255, 255, 1);
            background-color: rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 1);
            transition: opacity 0.05s ease-in, border 0.05s ease-in, color 0.05s;
        }
    }

    .content {
        font-size: 36px;
    }
`;
