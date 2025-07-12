import { css } from "lit";

export const styles = css`
    .canvas-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 0, 0, 0.1);
        z-index: 1000;
        pointer-events: none;
    }
`;
