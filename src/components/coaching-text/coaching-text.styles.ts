import { css } from "lit";

export const coachingTextStyles = css`
    @keyframes gradient-rotate {
        0% {
            background-position: 0% 50%;
        }

        100% {
            background-position: 100% 50%;
        }
    }

    @keyframes bounce-scale {
        0%,
        100% {
            transform: scale(1);
            /* letter-spacing: 0; */
        }
        50% {
            transform: scale(1.08);
            /* letter-spacing: 1px; */
        }
    }
    .coaching-text-container {
        padding: 32px 0 0 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        text-align: center;

        .header-text {
            letter-spacing: 4px;
        }

        .instruction-text {
            background: linear-gradient(
                270deg,
                var(--accent-0),
                var(--accent-0-dark),
                var(--accent-1),
                var(--accent-1-dark),
                var(--accent-2),
                var(--accent-2-dark),
                var(--accent-3),
                var(--accent-3-dark),
                var(--accent-0)
            );
            background-size: 400% 400%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
            transform: scale(1);
            transform-origin: center;
            text-align: center;
            animation: gradient-rotate 18s linear infinite, bounce-scale 2.4s ease-in-out infinite;
        }
    }
`;
