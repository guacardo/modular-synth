import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--text-primary);
            border-radius: 8px;
            background-color: var(--elevation-1);
        }

        .slider-container {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 16px;

            .label {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 20%;

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

        .button-io-container {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: center;
            text-align: center;
            gap: 16px;
            margin: 32px 0 16px;
        }

        @keyframes blink-active {
            0%,
            100% {
                background: radial-gradient(
                    circle at 60% 40%,
                    #baff7f 0%,
                    #4caf50 60%,
                    #333 100%
                );
                box-shadow: 0 0 8px 2px #7fff4f, 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid #2e7d32;
            }
            50% {
                background: radial-gradient(
                    circle at 60% 40%,
                    #baff7f00 0%,
                    #4caf5000 60%,
                    #333 100%
                );
                box-shadow: 0 0 2px 0px #7fff4f00, 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid #2e7d3200;
            }
        }

        @keyframes blink-connection-source {
            0%,
            100% {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-2) 0%,
                    var(--accent-2-dark) 80%,
                    #333 100%
                );
                box-shadow: 0 0 12px 3px var(--accent-2), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid var(--accent-2-dark);
            }
            50% {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-2) 0%,
                    var(--accent-2-dark) 80%,
                    #333 100%,
                    transparent 100%
                );
                box-shadow: 0 0 2px 0px var(--accent-2), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid transparent;
            }
        }

        .io-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 32px;

            .io-button {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: radial-gradient(
                    circle at 65% 35%,
                    #555 0%,
                    #444 40%,
                    #333 100%
                );
                border: 2px solid #444;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4),
                    0 0 0 2px var(--text-primary) inset,
                    0 4px 8px 0 rgba(0, 0, 0, 0.5) inset;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
                cursor: pointer;
            }

            .io-label {
                margin-top: 4px;
            }

            .io-button::after {
                content: "";
                display: block;
                width: 11px;
                height: 11px;
                background: radial-gradient(
                    circle at 60% 40%,
                    #777 0%,
                    #666 80%,
                    #333 100%
                );
                border-radius: 50%;
                border: 2px solid #222;
                box-shadow: 0 0 2px #000, 0 2px 4px #222 inset;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .io-button::before {
                content: "";
                position: absolute;
                left: 6px;
                top: 5px;
                width: 7px;
                height: 3px;
                background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0.7),
                    rgba(255, 255, 255, 0)
                );
                border-radius: 2px;
                opacity: 0.7;
                pointer-events: none;
            }

            .io-button:hover::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    #ffb300 0%,
                    #ff9800 60%,
                    #333 100%
                );
                box-shadow: 0 0 8px 2px #ff9800, 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid #b85c00;
            }

            .io-button.connected::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    #baff7f 0%,
                    #4caf50 60%,
                    #333 100%
                );
                box-shadow: 0 0 8px 2px #7fff4f, 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid #2e7d32;
            }

            .io-button.accent-0::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-0) 0%,
                    var(--accent-0-dark) 80%,
                    #333 100%
                );
                box-shadow: 0 0 8px 2px var(--accent-0), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid var(--accent-0-dark);
            }

            .io-button.accent-1::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-1) 0%,
                    var(--accent-1-dark) 80%,
                    #333 100%
                );
                box-shadow: 0 0 8px 2px var(--accent-1), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid var(--accent-1-dark);
            }

            .io-button.connection-source::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-2) 0%,
                    var(--accent-2-dark) 80%,
                    #333 100%
                );
                box-shadow: 0 0 12px 3px var(--accent-2), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid var(--accent-2-dark);
                animation: blink-connection-source 0.8s infinite;
            }

            .io-button.can-connect::after {
                background: radial-gradient(
                    circle at 60% 40%,
                    var(--accent-3) 0%,
                    var(--accent-3-dark) 80%,
                    #333 100%
                );
                box-shadow: 0 0 12px 3px var(--accent-3), 0 0 2px #000,
                    0 2px 4px #222 inset;
                border: 2px solid var(--accent-3-dark);
            }
        }
    `,
];
