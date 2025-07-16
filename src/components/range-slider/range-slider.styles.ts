import { css } from "lit";

export const styles = css`
    .slider-container {
        width: 100%;

        input[type="range"] {
            width: 100%;
            height: 3px;
            border-radius: 0;

            /* Remove rounded corners from track and set height */
            &::-webkit-slider-runnable-track {
                border-radius: 0;
                background: #626262;
            }
            &::-moz-range-track {
                border-radius: 0;
                background: #626262;
            }
            &::-ms-track {
                border-radius: 0;
                background: #626262;
            }

            /* Style the filled portion of the track */
            &::-webkit-slider-thumb {
                border-radius: 0;
                background: #aaaaaa;
            }
            &::-moz-range-progress {
                background: #aaaaaa;
                border-radius: 0;
            }
            &::-ms-fill-lower {
                background: #aaaaaa;
                border-radius: 0;
            }

            /* Remove rounded corners from thumb */
            &::-webkit-slider-thumb {
                border-radius: 0;
            }
            &::-moz-range-thumb {
                border-radius: 0;
            }
            &::-ms-thumb {
                border-radius: 0;
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
