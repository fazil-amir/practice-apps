import { useEffect, useState } from "react";

const fetchPosts = async (query: string) => {
	const resourceURL = new URL("https://jsonplaceholder.typicode.com/posts");
	if (query) {
		resourceURL.searchParams.append("name", query);
	}
	const response = await fetch(resourceURL);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
};

const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};

const useFetchPost = (query: string) => {
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const debouncedQuery = useDebounce(query, 500);

	useEffect(() => {
		if (debouncedQuery.trim() === "") {
			setResults([]);
			return;
		}
		if (debouncedQuery.length > 3) {
			setLoading(true);
			fetchPosts(debouncedQuery)
				.then(setResults)
				.catch(setError)
				.finally(() => setLoading(false));
			return;
		}
	}, [debouncedQuery]);

	return { results, loading, error };
};

export default function PostSearchDebounce() {
	const [query, setQuery] = useState("");

	const { results, loading, error } = useFetchPost(query);

	return (
		<>
			<h1>Post Search with Debounce</h1>

			<input
				type="text"
				className="field-input"
				placeholder="Search posts..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>

			{loading && <p className="practice-status">Loading...</p>}

			{error && (
				<p className="practice-status practice-status--error">Error: {error}</p>
			)}

			{results.length > 0 && (
				<ul className="practice-list">
					{results.map((post: { id: number; title: string; body: string }) => (
						<li key={post.id} className="practice-list__item">
							<h2>{post.title}</h2>
							<p>{post.body}</p>
						</li>
					))}
				</ul>
			)}

			{query.trim() !== "" &&
				query.trim().length > 3 &&
				results.length === 0 &&
				!loading &&
				!error && <p className="practice-status">No results found.</p>}
		</>
	);
}
