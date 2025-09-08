import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiOutlineExclamationCircle,
  HiPlus,
  HiPencil,
  HiTrash,
  HiTag,
  HiDocumentText,
  HiCalendar,
  HiCollection,
  HiX,
  HiCheck
} from "react-icons/hi";

const DashCategories = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    _id: null,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/category/all");
        const data = await res.json();
        if (res.ok) {
          setCategories(data);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchCategories();
    }
  }, [currentUser]);

  const handleDeleteCategory = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(`/api/category/delete/${categoryIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to remove category");
      } else {
        setCategories((prev) =>
          prev.filter((category) => category._id !== categoryIdToDelete)
        );
      }
    } catch (error) {
      console.error("Failed to remove category");
    }
  };

  const handleAddEditCategory = async (e) => {
    e.preventDefault();
    try {
      const method = currentCategory._id ? "PUT" : "POST";
      const url = currentCategory._id
        ? `/api/category/update/${currentCategory._id}`
        : "/api/category/create";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentCategory.name,
          description: currentCategory.description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (currentCategory._id) {
          setCategories((prev) =>
            prev.map((cat) => (cat._id === currentCategory._id ? data : cat))
          );
        } else {
          setCategories((prev) => [...prev, data]);
        }
        setCurrentCategory({ name: "", description: "", _id: null });
        setShowAddEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update category");
    }
  };

  const openEditModal = (category) => {
    setCurrentCategory({
      name: category.name,
      description: category.description,
      _id: category._id,
    });
    setShowAddEditModal(true);
  };

  const openAddModal = () => {
    setCurrentCategory({ name: "", description: "", _id: null });
    setShowAddEditModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-indigo-500 to-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Category Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Organize your content with custom categories
              </p>
            </div>
            
            {currentUser?.isAdmin && (
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <HiPlus className="w-5 h-5" />
                Add Category
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <HiCollection className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Categories
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
                <HiDocumentText className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {categories.reduce((acc, cat) => acc + (cat.postCount || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Posts Categorized
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                <HiTag className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {categories.filter(cat => cat.description).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  With Descriptions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {currentUser?.isAdmin && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={category._id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <HiTag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <HiCalendar className="w-3 h-3" />
                        <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-all duration-300 hover:scale-110"
                      title="Edit Category"
                    >
                      <HiPencil className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setCategoryIdToDelete(category._id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all duration-300 hover:scale-110"
                      title="Delete Category"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                    {category.description || "No description provided"}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <HiDocumentText className="w-4 h-4" />
                    <span>{category.postCount || 0} posts</span>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    category.postCount > 0
                      ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {category.postCount > 0 ? 'Active' : 'Unused'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl inline-block mb-4">
              <HiCollection className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first category to organize your content
            </p>
            {currentUser?.isAdmin && (
              <button 
                onClick={openAddModal}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <HiPlus className="w-5 h-5 inline mr-2" />
                Create First Category
              </button>
            )}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl inline-block mb-6">
                  <HiOutlineExclamationCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Delete Category
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Are you sure you want to delete this category? Posts using this category will become uncategorized.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteCategory}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Category Modal */}
        {showAddEditModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentCategory._id ? "Edit Category" : "Add New Category"}
                </h3>
                <button
                  onClick={() => setShowAddEditModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors duration-300"
                >
                  <HiX className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={currentCategory.name}
                    onChange={(e) =>
                      setCurrentCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    placeholder="Enter category name"
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={currentCategory.description}
                    onChange={(e) =>
                      setCurrentCategory((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Enter category description"
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                  />
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleAddEditCategory}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <HiCheck className="w-5 h-5" />
                    {currentCategory._id ? "Update" : "Create"}
                  </button>
                  <button
                    onClick={() => setShowAddEditModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashCategories;