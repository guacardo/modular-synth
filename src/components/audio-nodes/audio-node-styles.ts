import { css, unsafeCSS } from "lit";
import { appStyles } from "../../styles/app-styles";
import oscPng from "../../assets/osc.png";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--text-primary);
            border-radius: 8px;
            background-color: var(--elevation-1);
            padding: 8px;

            .node-title {
                text-align: center;
                text-transform: uppercase;
                margin-bottom: 8px;
                background: url(${unsafeCSS(oscPng)}) repeat-x center/auto 100%;

                span {
                    color: var(--text-primary);
                    background-color: var(--elevation-1);
                    padding: 0 8px;
                }
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
