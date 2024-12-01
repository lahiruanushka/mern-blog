import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiHeart } from "react-icons/hi";
import {
  addToFavorites,
  removeFromFavorites,
} from "../features/favorites/favoritesSlice";
import { useToast } from "../context/ToastContext";

const FavoriteButton = ({ post }) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const { items: favorites, loading } = useSelector((state) => state.favorites);
  const { currentUser } = useSelector((state) => state.user);

  const isFavorite = favorites?.some(
    (fav) => fav === post._id || fav.postId === post._id || fav._id === post._id
  );

  const handleFavoriteToggle = async () => {
    if (!currentUser) {
      showToast("Please log in to manage favorites.", "warning");
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

  if (!currentUser) return null;

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={loading}
      className={`
        group inline-flex items-center gap-2 px-3 py-2 rounded-full
        transition-all duration-300 focus:outline-none
        ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
        ${
          isFavorite
            ? "bg-red-50 text-red-500"
            : "bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-500"
        }
      `}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <HiHeart
        className={`w-5 h-5 transition-colors duration-300
          ${isFavorite ? "fill-current" : ""}
        `}
      />
      {loading && (
        <div className="w-4 h-4 border-2 border-red-500 rounded-full animate-spin border-t-transparent ml-1"></div>
      )}
    </button>
  );
};

export default FavoriteButton;
