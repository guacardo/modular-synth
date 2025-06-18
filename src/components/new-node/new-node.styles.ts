import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const newNodeStyles = [
    appStyles,
    css`
        .new-node-container {
            border-bottom: 1px solid var(--elevation-2);
            height: 100px;
            overflow: hidden;

            .panel-content {
                display: flex;
                flex-direction: row;
                transition: transform 0.4s cubic-bezier(0.6, 0, 0.4, 1);
                width: 100%;
                height: 100%;
            }

            .panel {
                width: 100%;
                height: 100%;
                flex-shrink: 0;
                box-sizing: border-box;
                padding: 16px;
            }

            .empty-node-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                opacity: 0.2;
                background-color: rgba(255, 255, 255, 0.1);
                transition: 1.2s ease-out;
                cursor: pointer;

                button {
                    background-color: transparent;
                    border: none;
                    font-weight: 100;
                    color: var(--text-primary);
                }

                &:hover {
                    opacity: 1;
                    background-color: rgba(255, 255, 255, 0.3);
                    transition: 0.3s ease-in;
                }
            }
        }
    `,
];
