import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--text-primary);
            border-radius: 8px;
            padding: calc(2 * var(--base-spacing));
            background-color: var(--elevation-3);
            cursor: pointer;
        }

        .slider-container {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        .isConnectSource {
            border: 1px solid var(--accent-0);

            .button-active {
                background-color: var(--accent-0-dark);
                color: black;
            }
        }

        .connectionCandidate {
            border: 1px solid var(--accent-1);
        }
    `,
];
