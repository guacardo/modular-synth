import { css } from "lit";

export const styles = css`
    .slider-container {
        width: 100%;

        input[type="range"] {
            width: 100%;
            height: 3px;
            border-radius: 0;
            margin: 0 0 6px 0;

            /* Remove rounded corners from track and set height */
            &::-webkit-slider-runnable-track {
                border-radius: 0;
                height: 3px;
                background: #626262;
            }
            &::-moz-range-track {
                border-radius: 0;
                height: 3px;
                background: #626262;
            }
            &::-ms-track {
                border-radius: 0;
                height: 3px;
                background: #626262;
            }

            /* Style the filled portion of the track */
            &::-moz-range-progress {
                background: var(--accent-3-dark);
                height: 3px;
                border-radius: 0;
            }
            &::-ms-fill-lower {
                background: var(--accent-3-dark);
                height: 3px;
                border-radius: 0;
            }

            /* Style the thumb as a circle */
            &::-webkit-slider-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--accent-3);
                border: none;
                cursor: pointer;
                -webkit-appearance: none;
                margin-top: -6.5px; /* Center the thumb on the 3px track */
            }
            &::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--accent-3);
                border: none;
                cursor: pointer;
            }
            &::-ms-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: var(--accent-3);
                border: none;
                cursor: pointer;
            }
        }

        .label {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: var(--text-secondary);

            .unit {
                color: var(--text-primary);
            }

            .value {
                color: var(--text-primary);
            }
        }

        .slider {
            flex: 1;
        }
    }
`;
