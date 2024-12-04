import React, { useEffect, useState } from "react";
import { Button, Modal, Table, TextInput, Label } from "flowbite-react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
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

  // State for add/edit form
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
        console.log(data.message);
        showToast("Failed to remove category. Please try again.", "error");
      } else {
        setCategories((prev) =>
          prev.filter((category) => category._id !== categoryIdToDelete)
        );
        showToast("Category deleted successfully", "success");
      }
    } catch (error) {
      console.log(error.message);
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
          // Update existing category
          setCategories((prev) =>
            prev.map((cat) => (cat._id === currentCategory._id ? data : cat))
          );
          showToast("Category updated successfully", "success");
        } else {
          // Add new category
          setCategories((prev) => [...prev, data]);
          showToast("Category added successfully", "success");
        }

        // Reset form and close modal
        setCurrentCategory({ name: "", description: "", _id: null });
        setShowAddEditModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
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
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser?.isAdmin && (
        <div className="mb-4">
          <Button onClick={openAddModal}>Add New Category</Button>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : currentUser?.isAdmin && categories.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Category Name</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
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
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {category.description || "No description"}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowDeleteModal(true);
                        setCategoryIdToDelete(category._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className="text-teal-500 hover:underline cursor-pointer"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>No categories found!</p>
      )}

      {/* Delete Confirmation Modal */}
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
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Add/Edit Category Modal */}
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
            <div className="flex justify-center gap-4">
              <Button type="submit" color="success">
                {currentCategory._id ? "Update Category" : "Add Category"}
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
