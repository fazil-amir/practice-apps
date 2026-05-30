import { lazy, Suspense, useState } from "react";
import "./array-polyfills.css";

const CodeViewer = lazy(() => import("../../components/code-viewer/code-viewer"));

const myMap = function (
	this: unknown[],
	callback: (value: unknown, index: number, array: unknown[]) => unknown,
) {
	const results: unknown[] = [];
	const arr = this;
	for (let i = 0; i < arr.length; i++) {
		results.push(callback(arr[i], i, arr));
	}
	return results;
};

const myFilter = function (
	this: unknown[],
	callback: (value: unknown, index: number, array: unknown[]) => unknown,
) {
	const results: unknown[] = [];
	const arr = this;

	for (let i = 0; i < arr.length; i++) {
		if (callback(arr[i], i, arr)) {
			results.push(arr[i]);
		}
	}

	return results;
};

const myReduce = function (
	this: unknown[],
	callback: (
		accumulator: unknown,
		currentValue: unknown,
		currentIndex: number,
		array: unknown[],
	) => unknown,
	initialValue: unknown,
) {
	let accumulator = initialValue;
	const arr = this;
	for (let i = 0; i < arr.length; i++) {
		accumulator = accumulator ? callback(accumulator, arr[i], i, arr) : arr[i];
	}
	return accumulator;
};

Array.prototype.myMap = myMap as typeof Array.prototype.myMap;
Array.prototype.myFilter = myFilter as typeof Array.prototype.myFilter;
Array.prototype.myReduce = myReduce as typeof Array.prototype.myReduce;

const MY_ARRAY = [1, 2, 3, 4, 5, 6];

const NESTED = [1, 2, [4, 5, [6, 7, [8, 9, [10, 11, [12, 13]]]]]];

function flattenArray(arr: unknown[], depth = Infinity): unknown[] {
	if (depth === 0) return arr;
	return arr.reduce<unknown[]>((acc, curr) => {
		return acc.concat(
			Array.isArray(curr) ? flattenArray(curr, depth - 1) : curr,
		);
	}, []);
}

type DemoId = "myMap" | "myFilter" | "myReduce" | "flatten";

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
		demoId: "myMap",
		title: "map polyfill",
		description: "Array.prototype.myMap = function (callback) { ... }",
		buttonLabel: "Run myMap",
		fn: myMap,
		run: () => MY_ARRAY.myMap((v, i) => v * i),
	},
	{
		id: getCounter(),
		demoId: "myFilter",
		title: "filter polyfill",
		description: "Array.prototype.myFilter = function (callback) { ... }",
		buttonLabel: "Run myFilter",
		fn: myFilter,
		run: () => MY_ARRAY.myFilter((v) => v > 2),
	},
	{
		id: getCounter(),
		demoId: "myReduce",
		title: "reduce polyfill",
		description:
			"Array.prototype.myReduce = function (callback, initialValue) { ... }",
		buttonLabel: "Run myReduce",
		fn: myReduce,
		run: () => MY_ARRAY.myReduce((acc, curr) => acc + curr, 0),
	},
	{
		id: getCounter(),
		demoId: "flatten",
		title: "flatten polyfill",
		description: "function flattenArray(arr, depth = Infinity) { ... }",
		buttonLabel: "Run flatten (depth 1)",
		fn: flattenArray,
		run: () => flattenArray(NESTED, 1),
	},
];

export default function ArrayPolyfills() {
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
			<h1>Array Polyfills</h1>
			<p>
				Run each polyfill independently. Results appear below in a code-style
				panel — input array <code>[1, 2, 3, 4, 5, 6]</code> for map / filter /
				reduce.
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
