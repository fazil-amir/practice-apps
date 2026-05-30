import { lazy, Suspense, useState } from "react";
import "./scoping.css";

const CodeViewer = lazy(() => import("../../components/code-viewer/code-viewer"));

function scoping() {
	function func() {
		var x = 10;
		console.log(x);
	}

	func();

	return "Check console";
}

function createBase(base = 0) {
	return function (num: number) {
		return base + num;
	};
}

type DemoId = "scoping" | "createBase";

type Demo = {
	id: number;
	demoId: DemoId;
	title: string;
	description: string;
	buttonLabel: string;
	fn: Function;
	run: () => unknown;
};

const getCounter = (function () {
	let count = 1;
	return () => count++;
})();

const DEMOS: Demo[] = [
	{
		id: getCounter(),
		demoId: "scoping",
		title: "Scoping Example",
		description:
			"Scope of a variable is the region of the program where it is defined.",
		buttonLabel: "Run scoping",
		fn: scoping,
		run: () => scoping(),
	},
	{
		id: getCounter(),
		demoId: "createBase",
		title: "add base to number",
		description: "Uses closure to add a base to a number.",
		buttonLabel: "Run createBase",
		fn: createBase,
		run: () => createBase(10)(20),
	},
];

export default function Scoping() {
	const [outputs, setOutputs] = useState<Partial<Record<number, string>>>({});
	const [visibleCode, setVisibleCode] = useState<
		Partial<Record<number, boolean>>
	>({});

	const runDemo = (demo: Demo) => {
		const result = demo.run();
		setOutputs((prev) => ({
			...prev,
			[demo.id]: JSON.stringify(result, null, 2),
		}));
	};

	const toggleCode = (id: number) => {
		setVisibleCode((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<>
			<h1>Scoping & Closures</h1>
			<p>
				Explore variable scope and closures. Some demos log to the console —
				open DevTools to see output.
			</p>

			<ul className="js-demo-list page-stack">
				{DEMOS.map((demo) => (
					<li key={demo.id} className="js-demo">
						<div className="js-demo__header">
							<h2>{demo.title}</h2>
							<button
								type="button"
								className="secondary-btn js-demo__code-toggle"
								onClick={() => toggleCode(demo.id)}
								aria-expanded={visibleCode[demo.id] ?? false}
							>
								{visibleCode[demo.id] ? "Hide code" : "Show code"}
							</button>
						</div>
						<p className="js-demo__desc">
							<code>{demo.description}</code>
						</p>
						{visibleCode[demo.id] && (
							<Suspense
								fallback={
									<pre className="code-output">
										<code>Loading…</code>
									</pre>
								}
							>
								<CodeViewer code={demo.fn.toString()} />
							</Suspense>
						)}
						<button
							type="button"
							className="primary-btn"
							onClick={() => runDemo(demo)}
						>
							{demo.buttonLabel}
						</button>
						<pre className="code-output" aria-live="polite">
							<code>
								{outputs[demo.id] ?? "// Click the button to see output"}
							</code>
						</pre>
					</li>
				))}
			</ul>
		</>
	);
}
