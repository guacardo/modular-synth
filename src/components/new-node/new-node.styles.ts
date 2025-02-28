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
