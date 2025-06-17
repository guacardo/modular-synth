import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const localStorageStyles = [
    appStyles,
    css`
        .container {
            display: block;
            position: absolute;
            right: 8px;
            top: 16px;

            input[type="text"] {
                width: 200px;
                padding: 8px 16px;
                border: 1px solid #ccc;
                background-color: var(--elevation-0);
                color: var(--text-primary);
            }
        }
    `,
];
