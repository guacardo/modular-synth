import { css } from "lit";

export const sidePanelStyles = css`
    .side-panel-container {
        position: fixed;
        top: 0;
        height: 100vh;
        width: 20vw;
        overflow-y: scroll;
        padding: 16px;
        background-color: var(--elevation-2);
        border-left: 1px solid var(--accent-0);

        /* Hide scrollbars */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
    }

    .side-panel-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari, and Opera */
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }
`;
