import { useEffect, useState } from 'react'
import { fetchPosts } from '../../services/post-pagination.service'

const LIMIT = 5;

function PostPagination() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchPosts()
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  const handlePrevious = () => {
    setCurrentPage((prevPage) => Math.max(0, prevPage - LIMIT));
  }

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + LIMIT);
  }

  return (
    <>
      <h1>Post Pagination</h1>
      {posts.slice(currentPage, currentPage + LIMIT).map((post: { id: number; title: string; body: string }) => (
        <article key={post.id} className="practice-card">
          <h2>({post.id}): {post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
      <div className="page-pagination">
        <button type="button" className="secondary-btn" onClick={handlePrevious} disabled={currentPage === 0}>
          Previous
        </button>
        <button type="button" className="secondary-btn" onClick={handleNext} disabled={currentPage + LIMIT >= posts.length}>
          Next
        </button>
      </div>
    </>
  )
}

export default PostPagination
