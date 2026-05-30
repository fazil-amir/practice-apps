import { useState } from "react";
import "./javascript.css";

Array.prototype.myMap = function (callback) {
	const results = [];
	const arr = this;
	for (let i = 0; i < arr.length; i++) {
		results.push(callback(arr[i], i, arr));
	}
	return results;
};

Array.prototype.myFilter = function (callback) {
	const results = [];
	const arr = this;

	for (let i = 0; i < arr.length; i++) {
		if (callback(arr[i], i, arr)) {
			results.push(arr[i]);
		}
	}

	return results;
};

Array.prototype.myReduce = function (callback, initialValue) {
	let accumulator = initialValue;
	const arr = this;
	for (let i = 0; i < arr.length; i++) {
		accumulator = accumulator ? callback(accumulator, arr[i], i, arr) : arr[i];
	}
	return accumulator;
};

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
	id: DemoId;
	title: string;
	description: string;
	buttonLabel: string;
	run: () => unknown;
};

const DEMOS: Demo[] = [
	{
		id: "myMap",
		title: "myMap",
		description: "MY_ARRAY.myMap((v, i) => v * i)",
		buttonLabel: "Run myMap",
		run: () => MY_ARRAY.myMap((v, i) => v * i),
	},
	{
		id: "myFilter",
		title: "myFilter",
		description: "MY_ARRAY.myFilter((v) => v > 2)",
		buttonLabel: "Run myFilter",
		run: () => MY_ARRAY.myFilter((v) => v > 2),
	},
	{
		id: "myReduce",
		title: "myReduce",
		description: "MY_ARRAY.myReduce((acc, curr) => acc + curr, 0)",
		buttonLabel: "Run myReduce",
		run: () => MY_ARRAY.myReduce((acc, curr) => acc + curr, 0),
	},
	{
		id: "flatten",
		title: "flattenArray",
		description: "flattenArray(NESTED, 1)",
		buttonLabel: "Run flatten (depth 1)",
		run: () => flattenArray(NESTED, 1),
	},
];

export default function Javascript() {
	const [outputs, setOutputs] = useState<Partial<Record<DemoId, string>>>({});

	const runDemo = (demo: Demo) => {
		const result = demo.run();
		setOutputs((prev) => ({
			...prev,
			[demo.id]: JSON.stringify(result, null, 2),
		}));
	};

	return (
		<>
			<h1>Javascript Practice</h1>
			<p>
				Run each polyfill independently. Results appear below in a code-style
				panel — input array <code>[1, 2, 3, 4, 5, 6]</code> for map / filter /
				reduce.
			</p>

			<ul className="js-demo-list page-stack">
				{DEMOS.map((demo) => (
					<li key={demo.id} className="js-demo">
						<h2>{demo.title}</h2>
						<p className="js-demo__desc">
							<code>{demo.description}</code>
						</p>
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
