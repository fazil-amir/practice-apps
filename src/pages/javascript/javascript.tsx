import './javascript.css';

Array.prototype.myMap = function (callback) {
	const results = [];
	const arr = this;

	for (let i = 0; i < arr.length; i++) {
		results.push(callback(arr[i], i, arr));
	}

	return results;
};

export default function Javascript() {
	const runMyMap = () => {
		[1, 2, 3, 4].myMap((v, i) => v + i);
	};

	const runMethod = () => {
		runMyMap();
	};

	return (
		<>
			<h1>Javascript Practice</h1>
			<button type="button" className="btn-primary" onClick={runMethod}>
				Click Me
			</button>
		</>
	);
}
