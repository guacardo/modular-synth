import { css } from "lit";

export const appStyles = css`
    .app {
        background-color: var(--elevation-0);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .button {
        background-color: var(--elevation-0);
        color: var(--text-primary);
        border: 1px solid var(--border-0);
        padding: var(--base-spacing) calc(2 * var(--base-spacing));
    }
`;
