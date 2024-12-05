import React, { useEffect, useState } from "react";
import { Button, Modal, Table, TextInput, Label } from "flowbite-react";
import { useSelector } from "react-redux";
import {
  HiOutlineExclamationCircle,
  HiPlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import Loading from "./Loading";
import { useToast } from "../context/ToastContext";

const DashCategories = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [currentCategory, setCurrentCategory] = useState({
    name: "",
    description: "",
    _id: null,
  });

  // Fetch categories effect remains the same...
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

  // Handlers remain the same...
  const handleDeleteCategory = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(`/api/category/delete/${categoryIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Failed to remove category. Please try again.", "error");
      } else {
        setCategories((prev) =>
          prev.filter((category) => category._id !== categoryIdToDelete)
        );
        showToast("Category deleted successfully", "success");
      }
    } catch (error) {
      showToast("Failed to remove category. Please try again.", "error");
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
          showToast("Category updated successfully", "success");
        } else {
          setCategories((prev) => [...prev, data]);
          showToast("Category added successfully", "success");
        }
        setCurrentCategory({ name: "", description: "", _id: null });
        setShowAddEditModal(false);
      }
    } catch (error) {
      showToast("Failed to update category. Please try again.", "error");
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

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {currentUser?.isAdmin && (
        <div className="py-4">
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <HiPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : currentUser?.isAdmin && categories.length > 0 ? (
        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <div className="hidden sm:block">
                  <Table hoverable>
                    <Table.Head>
                      <Table.HeadCell>Date Created</Table.HeadCell>
                      <Table.HeadCell>Category Name</Table.HeadCell>
                      <Table.HeadCell>Description</Table.HeadCell>
                      <Table.HeadCell>Actions</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {categories.map((category) => (
                        <Table.Row
                          key={category._id}
                          className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                          <Table.Cell>
                            {new Date(category.createdAt).toLocaleDateString()}
                          </Table.Cell>
                          <Table.Cell>
                            <span className="font-medium">{category.name}</span>
                          </Table.Cell>
                          <Table.Cell>
                            {category.description || "No description"}
                          </Table.Cell>
                          <Table.Cell>
                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                color="gray"
                                onClick={() => openEditModal(category)}
                              >
                                <HiPencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                color="failure"
                                onClick={() => {
                                  setShowDeleteModal(true);
                                  setCategoryIdToDelete(category._id);
                                }}
                              >
                                <HiTrash className="w-4 h-4" />
                              </Button>
                            </div>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </div>

                {/* Mobile view */}
                <div className="sm:hidden">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {categories.map((category) => (
                      <li key={category._id} className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.name}</span>
                          <div className="flex space-x-2">
                            <Button
                              size="xs"
                              color="gray"
                              onClick={() => openEditModal(category)}
                            >
                              <HiPencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="xs"
                              color="failure"
                              onClick={() => {
                                setShowDeleteModal(true);
                                setCategoryIdToDelete(category._id);
                              }}
                            >
                              <HiTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {category.description || "No description"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-4">No categories found!</p>
      )}

      {/* Modals remain largely the same but with improved responsive styling */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this category?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteCategory}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={showAddEditModal}
        onClose={() => setShowAddEditModal(false)}
        popup
        size="md"
      >
        <Modal.Header>
          {currentCategory._id ? "Edit Category" : "Add New Category"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddEditCategory} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <TextInput
                id="name"
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <TextInput
                id="description"
                value={currentCategory.description}
                onChange={(e) =>
                  setCurrentCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter category description"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button type="submit" color="success">
                {currentCategory._id ? "Update" : "Add"}
              </Button>
              <Button color="gray" onClick={() => setShowAddEditModal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashCategories;
