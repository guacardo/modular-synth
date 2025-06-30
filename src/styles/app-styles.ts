import { css } from "lit";

export const appStyles = css`
    .app {
        background-color: var(--elevation-0);
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
        margin: 0;
    }

    .button {
        font-family: "Courier New", Courier, monospace;
        text-transform: lowercase;
        background-color: var(--elevation-3);
        color: var(--text-primary);
        border: 1px solid var(--accent-0);
        padding: 2px 4px;
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

        &.button-active {
            background-color: var(--accent-0-dark);
            color: black;
        }
    }

    .custom-select {
        background: #181818;
        color: var(--text-primary);
        border: 1px solid #444;
        padding: 6px 32px 6px 12px;
        font-family: "Courier New", monospace;
        font-size: 12px;
        appearance: none;
        outline: none;
        transition: border 0.2s;
        box-sizing: border-box;
        margin: 0 4px;
    }
    .custom-select:focus {
        border-color: #4ecdc4;
    }
    .custom-select option {
        background: #222;
        color: #fff;
    }

    .custom-select optgroup {
        font-style: normal;
        color: #aaa;
    }
`;
