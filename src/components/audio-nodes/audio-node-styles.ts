import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--text-primary);
            border-radius: 8px;
            background-color: var(--elevation-1);
            padding: 8px;
        }

        .slider-container {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;

            .label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 20%;

                .unit {
                    color: var(--text-primary);
                }

                .value {
                    color: var(--text-primary);
                }
            }

            .slider {
                flex: 1;
            }
        }

        .button-io-container {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: center;
            text-align: center;
            gap: 16px;
            margin: 32px 0 16px;
        }
    `,
];
