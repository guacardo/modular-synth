import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const localStorageStyles = [
    appStyles,
    css`
        .container {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            position: absolute;
            right: 8px;
            top: 16px;

            input[type="text"] {
                width: 100px;
                padding: 8px 16px;
                border: 1px solid #aaa;
                background-color: var(--elevation-0);
                color: var(--text-primary);
                font-family: "Inconsolata", monospace;
            }
        }
    `,
];
