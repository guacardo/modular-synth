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
            background-color: var(--elevation-1);
            border: 1px solid var(--accent-0);
            border-radius: 4px;
            padding: 8px;

            input[type="text"] {
                box-sizing: border-box;
                width: 100%;
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                background-color: var(--elevation-2);
                color: var(--text-primary);
                font-family: "Inconsolata", monospace;

                &:focus {
                    outline: none;
                    box-shadow: 0 0 4px var(--accent-0-dark);
                }
            }

            .button {
                width: 100%;
            }
        }
    `,
];
