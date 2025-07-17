import { css, unsafeCSS } from "lit";
import { appStyles } from "../../styles/app-styles";
import oscPng from "../../assets/osc.png";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--elevation-4);
            background-color: var(--elevation-1);
            padding: 16px;

            .node-title {
                font-size: 16px;
                text-align: center;
                text-transform: uppercase;
                margin-bottom: 16px;
                /* background: url(${unsafeCSS(oscPng)}) repeat-x center/auto 100%; */

                span {
                    color: var(--text-primary);
                    background-color: var(--elevation-1);
                    padding: 0 8px;
                }
            }

            .sliders {
                display: flex;
                flex-direction: column;
                gap: 16px;
                margin-bottom: 16px;
            }
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            margin: 16px 0;
        }

        .io-jack-container {
            display: flex;
            align-items: center;
            justify-content: space-around;
        }
    `,
];
