import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="p-12">
        <div className="max-w-6xl mx-auto flex flex-col gap-6 items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold">
            Welcome to ByteThoughts
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl">
            Explore in-depth articles, tutorials, and guides on web development,
            software engineering, programming languages, IT infrastructure, and
            emerging technologies in the programming world.
          </p>

          <Link
            to="/search"
            className="mt-4 px-8 py-3 bg-white text-teal-500 font-semibold rounded-full shadow-lg hover:bg-teal-100 transition duration-300"
          >
            Explore Posts
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-6 ml-28">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={"/search"}
              className="text-lg text-teal-500 hover:underline text-center"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
