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
        font-family: "Inconsolata", monospace;
        text-transform: lowercase;
        background-color: var(--elevation-3);
        color: var(--text-primary);
        border: 1px solid var(--accent-3);
        padding: 2px 4px;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 4px 0 0 var(--accent-3-dark), /* solid base shadow, connected */ 0 8px 16px 0 rgba(0, 0, 0, 0.18);

        &:active {
            box-shadow: 0 1px 0 0 var(--accent-3-dark), 0 2px 4px 0 rgba(0, 0, 0, 0.22);
            transform: translateY(3px);
        }

        &.button-active {
            background-color: var(--accent-3);
            color: black;
        }
    }

    .custom-select {
        background: var(--elevation-2);
        color: var(--text-primary);
        border: none;
        margin: 0;
        padding: 6px 32px 6px 12px;
        font-family: "Inconsolata", monospace;
        font-size: 12px;
        appearance: none;
        outline: none;
        transition: border 0.2s;
        box-sizing: border-box;
        width: 100%;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ccc' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 8px center;
        background-repeat: no-repeat;
        background-size: 16px;
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
