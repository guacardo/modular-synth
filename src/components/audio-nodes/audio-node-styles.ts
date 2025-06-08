import { css } from "lit";
import { appStyles } from "../../styles/app-styles";

export const audioNodeStyles = [
    appStyles,
    css`
        .node {
            border: 1px solid var(--text-primary);
            border-radius: 8px;
            padding: calc(2 * var(--base-spacing));
            background-color: var(--elevation-3);
            cursor: pointer;
        }

        .slider-container {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }

        .isConnectSource {
            border: 1px solid var(--accent-0);
        }

        .connectionCandidate {
            border: 1px solid var(--accent-1);
        }

        .io-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .io-button {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: radial-gradient(circle at 65% 35%, #555 0%, #444 40%, #333 100%);
                border: 2px solid #444;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4), 0 0 0 2px var(--text-primary) inset, 0 4px 8px 0 rgba(0, 0, 0, 0.5) inset;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: visible;
                cursor: pointer;
            }

            .io-button::after {
                content: "";
                display: block;
                width: 11px;
                height: 11px;
                background: radial-gradient(circle at 60% 40%, #777 0%, #666 80%, #333 100%);
                border-radius: 50%;
                border: 2px solid #222;
                box-shadow: 0 0 2px #000, 0 2px 4px #222 inset;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                transition: background 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                    border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .io-button::before {
                content: "";
                position: absolute;
                left: 6px;
                top: 5px;
                width: 7px;
                height: 3px;
                background: linear-gradient(90deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
                border-radius: 2px;
                opacity: 0.7;
                pointer-events: none;
            }

            .io-button:hover::after {
                background: radial-gradient(circle at 60% 40%, #ffb300 0%, #ff9800 60%, #333 100%);
                box-shadow: 0 0 8px 2px #ff9800, 0 0 2px #000, 0 2px 4px #222 inset;
                border: 2px solid #b85c00;
            }

            .io-button.active::after {
                background: radial-gradient(circle at 60% 40%, #baff7f 0%, #4caf50 60%, #333 100%);
                box-shadow: 0 0 8px 2px #7fff4f, 0 0 2px #000, 0 2px 4px #222 inset;
                border: 2px solid #2e7d32;
            }
        }
    `,
];
