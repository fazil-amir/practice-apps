import { lazy, Suspense, useState } from "react";
import "./promises.css";

const CodeViewer = lazy(() => import("../../components/code-viewer/code-viewer"));

function runOnce(func: (...args: unknown[]) => unknown) {
	let run: unknown;
	const cacheMap: Record<string, boolean> = {};
	return function (...args: unknown[]) {
		const cacheKey = JSON.stringify(args);

		if (func && !(cacheKey in cacheMap)) {
			run = func(...args);
			cacheMap[cacheKey] = true;
		}

		return run;
	};
}

const p1 = new Promise((resolve, reject) => {
	const flag = true;
	setTimeout(() => {
		return flag ? resolve("Promise 1 resolved") : reject("Promise 1 rejected");
	}, 1000);
});

const p2 = new Promise((resolve, reject) => {
	const flag = false;
	setTimeout(() => {
		return flag ? resolve("Promise 2 resolved") : reject("Promise 2 rejected");
	}, 500);
});

const p3 = new Promise((resolve, reject) => {
	const flag = true;
	setTimeout(() => {
		return flag ? resolve("Promise 3 resolved") : reject("Promise 3 rejected");
	}, 2000);
});

function promiseAll() {
	return Promise.all([p1, p2, p3])
		.then((results) => {
			console.log(results);
		})
		.catch((error) => {
			console.log(error);
		});
}

function promiseAny() {
	return Promise.any([p1, p2, p3])
		.then((result) => {
			console.log(result);
		})
		.catch((error) => {
			console.log(error);
		});
}

function promiseRace() {
	return Promise.race([p1, p2, p3])
		.then((result) => {
			console.log(result);
		})
		.catch((error) => {
			console.log(error);
		});
}

function promiseAllSettled() {
	return Promise.allSettled([p1, p2, p3])
		.then((results) => {
			console.log(results);
		})
		.catch((error) => {
			console.log(error);
		});
}

function promises() {
	return {
		all: promiseAll,
		any: promiseAny,
		race: promiseRace,
		allSettled: promiseAllSettled,
	};
}

type DemoId = "runOnce" | "promises";

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
		demoId: "runOnce",
		title: "runOnce",
		description: "Uses closure to cache the result of a function call.",
		buttonLabel: "Run runOnce",
		fn: runOnce,
		run: () => {
			const runOnceFunc = runOnce((num1, num2) =>
				console.log("Hello world", num1, num2),
			);
			runOnceFunc(1, 2);
			runOnceFunc(1.1);
			runOnceFunc(2);
			return "Check console";
		},
	},
	{
		id: getCounter(),
		demoId: "promises",
		title: "promises all",
		description:
			"Returns an array of resolved values. If any promise is rejected, it throws an error.",
		buttonLabel: "Run promises.all()",
		fn: promiseAll,
		run: () => promises().all(),
	},
	{
		id: getCounter(),
		demoId: "promises",
		title: "promises any",
		description:
			"Returns the first resolved promise. If all promises are rejected, it throws an AggregateError.",
		buttonLabel: "Run promises.any()",
		fn: promiseAny,
		run: () => promises().any(),
	},
	{
		id: getCounter(),
		demoId: "promises",
		title: "promises race",
		description:
			"Returns the first resolved promise. If all promises are rejected, it throws an AggregateError. It is similar to Promise.any(), but it returns the first rejected promise.",
		buttonLabel: "Run promises.race()",
		fn: promiseRace,
		run: () => promises().race(),
	},
	{
		id: getCounter(),
		demoId: "promises",
		title: "promises allSettled",
		description:
			"Returns an array of objects that represent the outcome of each promise. It is similar to Promise.all(), but it returns the result of each promise, even if it is rejected.",
		buttonLabel: "Run promises.allSettled()",
		fn: promiseAllSettled,
		run: () => promises().allSettled(),
	},
];

export default function Promises() {
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
			<h1>Promises & Memoization</h1>
			<p>
				Run promise combinators and memoization demos. Async results log to the
				console — open DevTools to see output.
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
