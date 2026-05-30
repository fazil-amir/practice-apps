interface Array<T> {
	myMap<U>(callback: (value: T, index: number, array: T[]) => U): U[];
}

interface Array<T> {
	myFilter<U>(callback: (value: T, index: number, array: T[]) => U): U[];
}

interface Array<T> {
	myReduce<U>(
		callback: (
			accumulator: U,
			currentValue: T,
			currentIndex: number,
			array: T[],
		) => U,
		initialValue: U,
	): U;
}
