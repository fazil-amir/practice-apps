import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./code-viewer.css";

type CodeViewerProps = {
	code: string;
	language?: string;
	showLineNumbers?: boolean;
};

export default function CodeViewer({
	code,
	language = "javascript",
	showLineNumbers = true,
}: CodeViewerProps) {
	return (
		<div className="code-viewer">
			<SyntaxHighlighter
				language={language}
				style={oneLight}
				showLineNumbers={showLineNumbers}
				customStyle={{
					margin: 0,
					padding: "14px 16px",
					background: "var(--code-bg)",
					border: "1px solid var(--border-subtle)",
					borderRadius: "var(--radius-sm)",
					fontSize: "0.8125rem",
					lineHeight: 1.5,
				}}
				lineNumberStyle={{
					minWidth: "2.25em",
					paddingRight: "1em",
					color: "var(--text-muted)",
					userSelect: "none",
				}}
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}
