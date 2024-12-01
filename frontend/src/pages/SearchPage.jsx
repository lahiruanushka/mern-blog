import { Alert, Button, Select, Spinner, TextInput, Card } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiArrowRight, HiFilter, HiSearch } from "react-icons/hi";
import PostCard from "../components/PostCard";

export default function SearchPage() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        sort: sortFromUrl || "desc",
        category: categoryFromUrl || "uncategorized",
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await res.json();
        setPosts(data.posts);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    setSidebarData({ ...sidebarData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        setShowMore(data.posts.length === 9);
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[300px_1fr] gap-8">
        {/* Enhanced Sidebar */}
        <Card 
          className="h-fit sticky top-4 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            transition-colors duration-300"
        >
          <form 
            className="flex flex-col space-y-6" 
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <HiSearch className="text-gray-500 dark:text-gray-400" />
                <label 
                  htmlFor="searchTerm" 
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Search Term
                </label>
              </div>
              <TextInput
                icon={HiSearch}
                placeholder="Search posts..."
                id="searchTerm"
                type="text"
                value={sidebarData.searchTerm}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <HiFilter className="text-gray-500 dark:text-gray-400" />
                <label 
                  htmlFor="sort" 
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Sort Order
                </label>
              </div>
              <Select 
                id="sort" 
                value={sidebarData.sort} 
                onChange={handleChange}
              >
                <option value="desc">Latest Posts</option>
                <option value="asc">Oldest Posts</option>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <HiFilter className="text-gray-500 dark:text-gray-400" />
                <label 
                  htmlFor="category" 
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Category
                </label>
              </div>
              <Select
                id="category"
                value={sidebarData.category}
                onChange={handleChange}
              >
                <option value="uncategorized">All Categories</option>
                <option value="reactjs">React.js</option>
                <option value="nextjs">Next.js</option>
                <option value="javascript">JavaScript</option>
              </Select>
            </div>

            <Button 
              type="submit" 
              gradientDuoTone="purpleToPink" 
              className="w-full"
            >
              Apply Filters
              <HiArrowRight className="ml-2" />
            </Button>
          </form>
        </Card>

        {/* Main Content Area */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8 pb-4 border-b-2 border-purple-500">
            Search Results
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center min-h-[500px]">
              <Spinner size="xl" color="purple" />
            </div>
          )}

          {/* No Posts Found */}
          {!loading && posts.length === 0 && (
            <Alert 
              color="failure" 
              className="max-w-2xl mx-auto"
            >
              <span className="font-medium">No posts found!</span> Try adjusting your search filters.
            </Alert>
          )}

          {/* Posts Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading && posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Show More Button */}
          {showMore && (
            <div className="text-center mt-8">
              <Button 
                onClick={handleShowMore} 
                gradientDuoTone="greenToBlue"
                className="mx-auto"
              >
                Load More Posts
                <HiArrowRight className="ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}