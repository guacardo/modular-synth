import { css } from "lit";

export const canvasOverlayStyles = css`
    :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 1000;
        user-select: none;
    }

    canvas {
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: block;
    }

    /* Ensure the overlay appears above other content but below any modals */
    :host(.debug) {
        border: 2px dashed rgba(255, 0, 0, 0.5);
    }

    /* For development - make overlay visible */
    :host(.visible-overlay) canvas {
        background-color: rgba(0, 0, 0, 0.1);
    }
`;
