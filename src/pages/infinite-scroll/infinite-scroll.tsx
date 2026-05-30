import './infinite-scroll.css';
import { useState, useEffect, useRef } from "react";

const LIMIT = 10;
const MAX_COUNT = 100;

type Post = {
	id: number,
	title: string,
	body: string,
}

const fetchPosts = async (page = 1, limit = LIMIT): Promise<Post[]> => {
	try {
		const url = new URL(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}&_page=${page}`);
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Error in calling "fetch post" api');
		}
		return response.json();
	}
	catch {
		throw new Error('Something went wrong while calling "fetch post" API');
	}
}

const useFetchPost = () => {

	const [isLoading, setIsLoading] = useState(false);
	const [postData, setPostData] = useState<Post[]>([]);
	const [error, setError] = useState(null);

	const callFetchPosts = (page: number = 1) => {
		setIsLoading(true);
		fetchPosts(page)
			.then((newPosts) =>{
				setPostData(oldPosts => ([
					...oldPosts,
					...newPosts
				]))
			})
			.catch(e => {
				setError(e)
			})
			.finally(() =>{
				setIsLoading(false);
			})
	}

	return {
		callFetchPosts,
		isLoading,
		postData,
		error
	}
}

export default function InfiniteScroll() {
	const { isLoading, error, postData, callFetchPosts } = useFetchPost();

	const [page, setPage] = useState(1);

	const sentinelElementRef = useRef<HTMLDivElement | null>(null)

	const postEnded = !!(postData.length >= MAX_COUNT);

	useEffect(() => {
		callFetchPosts(page)
	}, [page])

	useEffect(() => {
		const refElement = sentinelElementRef.current;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !isLoading) {
				setPage(p => p + 1)
			}
		}, {
			threshold: 1
		});

		if (refElement) {
			observer.observe(refElement)
		}

		return () => {
			if (refElement) {
				observer.unobserve(refElement);
			}
		}

	}, [isLoading]);

	return (
		<>
			<h1>Infinite Scroll</h1>
			{postData.map((p) => (
				<article key={p.id} className="practice-card">
					<h2>{p.title}</h2>
					<p>{p.body}</p>
				</article>
			))}

			{!!postData.length && <div ref={sentinelElementRef} aria-hidden />}

			{!!isLoading && <p className="practice-status">Loading...</p>}
			{!!error && <p className="practice-status practice-status--error">Something went wrong.</p>}
			<button
				type="button"
				className="btn-primary"
				onClick={() => setPage((pv) => pv + 1)}
				disabled={postEnded}
			>
				Load more
			</button>
		</>
	)
}
