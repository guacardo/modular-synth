import { css } from "lit";

export const appStyles = css`
    .app {
        background-color: var(--elevation-0);
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .button {
        font-family: "Courier New", Courier, monospace;
        text-transform: lowercase;
        background-color: var(--elevation-3);
        color: var(--text-primary);
        border: 1px solid var(--accent-0);
        padding: var(--base-spacing) calc(2 * var(--base-spacing));
        border-radius: 4px;
        cursor: pointer;
        transition: background-color var(--hover-timing) ease, color var(--hover-timing) ease;
        box-shadow: 0 4px 0 0 var(--accent-0), /* solid base shadow, connected */ 0 8px 16px 0 rgba(0, 0, 0, 0.18);

        &:hover {
            background-color: var(--elevation-4);
        }

        &:active {
            box-shadow: 0 1px 0 0 var(--accent-0), 0 2px 4px 0 rgba(0, 0, 0, 0.22);
            transform: translateY(3px);
        }
    }
`;
