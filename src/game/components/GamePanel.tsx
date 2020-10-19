import { css, Global } from "@emotion/core";
import styled from "@emotion/styled";
import emotionReset from "emotion-reset";
import React, { FC, ReactNode } from "react";

const CenteredPanel = styled.div`
	margin: 0 auto;
	text-align: center;
	height: 100vh;
`;

interface Props {
	children: ReactNode;
}

const GamePanel: FC<Props> = ({ children }: Props) => {
	return (
		<>
			<Global
				styles={css`
					${emotionReset}

					*, *::after, *::before {
						box-sizing: border-box;
					}

					body {
						padding-top: 20px;
						color: #000;
					}

					h1 {
						font-size: 2rem;
						margin-bottom: 20px;
					}

					h2 {
						font-size: 1.5rem;
						margin-top: 20px;
						margin-bottom: 20px;
					}

					@media (prefers-color-scheme: dark) {
						body {
							background-color: #181a1b;
							color: #fff;
						}
					}

					.reset {
						color: #fff;
						background-color: #dc3545;
						border-color: #dc3545;
						padding: 0.375rem 0.75rem;
						font-size: 1rem;
						line-height: 1.5;
						border-radius: 0.25rem;
						transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out,
							box-shadow 0.15s ease-in-out;
					}
				`}
			/>
			<CenteredPanel>{children}</CenteredPanel>
		</>
	);
};

export default GamePanel;
