import { HiHeart } from "react-icons/hi";
import { Link } from "react-router-dom";
import {
  addToFavorites,
  removeFromFavorites,
} from "../features/favorites/favoritesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../context/ToastContext";
import LoginPrompt from "./LoginPrompt";
import { useState } from "react";

export default function PostCard({ post }) {
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const dispatch = useDispatch();
  const { showToast } = useToast();

  // Redux state
  const {
    items: favorites,
    error,
    loading,
    message,
  } = useSelector((state) => state.favorites);
  const { currentUser } = useSelector((state) => state.user);

  // Check if post is in favorites - ensure we're comparing the correct ID format
  const isFavorite = favorites?.some(
    (fav) => fav === post._id || fav.postId === post._id || fav._id === post._id
  );

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    try {
      if (isFavorite) {
        await dispatch(removeFromFavorites(post._id)).unwrap();
        showToast("Removed from favorites", "success");
      } else {
        await dispatch(addToFavorites(post._id)).unwrap();
        showToast("Added to favorites", "success");
      }
    } catch (error) {
      showToast(error.message || "Failed to update favorites", "error");
    }
  };

  const handleCloseLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  return (
    <div className="group relative max-w-[430px] border border-teal-500 hover:border-2 hover:shadow-lg h-[400px] overflow-hidden rounded-lg transition-all">
      <Link to={`/post/${post.slug}`}>
        <div className="relative">
          <img
            src={post.image}
            alt="post cover"
            className="h-[260px] w-full object-cover group-hover:h-[200px] transition-all duration-300 z-20"
          />
          <div className="absolute top-2 left-2 bg-teal-500 text-white px-3 py-1 rounded-md text-sm">
            {post.category}
          </div>
        </div>
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold line-clamp-2">{post.title}</p>
          <button
            className={`relative group/btn p-2 rounded-full transition-transform duration-300 hover:scale-110 active:scale-95
                ${loading ? "cursor-not-allowed" : "cursor-pointer"}
                ${
                  isFavorite
                    ? "text-red-500"
                    : "text-teal-500 hover:text-red-500"
                }`}
            onClick={handleFavoriteToggle}
            disabled={loading}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <HiHeart
              className={`h-6 w-6 transition-all duration-300 ease-in-out
                  ${
                    isFavorite
                      ? "fill-current animate-favorite"
                      : "group-hover/btn:scale-110"
                  }
                  ${loading ? "opacity-50" : "opacity-100"}
                `}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-current rounded-full animate-spin border-t-transparent"></div>
              </div>
            )}
          </button>
        </div>

        <Link
          to={`/post/${post.slug}`}
          className="z-10 group-hover:bottom-0 absolute bottom-4 left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2"
        >
          Read article
        </Link>
      </div>

      <LoginPrompt
        isOpen={isLoginPromptOpen}
        onClose={handleCloseLoginPrompt}
      />
    </div>
  );
}
