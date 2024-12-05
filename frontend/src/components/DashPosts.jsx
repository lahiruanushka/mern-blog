import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle, HiPencil, HiTrash } from "react-icons/hi";
import Loading from "./Loading";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          setShowMore(data.posts.length >= 9);
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    try {
      setLoadingMore(true);
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${userPosts.length}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        setShowMore(data.posts.length >= 9);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {currentUser?.isAdmin && (
        <div className="mb-6">
          <Link to="/dashboard?tab=create-post">
            <Button gradientDuoTone="purpleToPink" className="w-full sm:w-auto">
              Create a post
            </Button>
          </Link>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : currentUser?.isAdmin && userPosts.length > 0 ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell className="hidden lg:table-cell">
                Date
              </Table.HeadCell>
              <Table.HeadCell className="hidden md:table-cell">
                Image
              </Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell className="hidden sm:table-cell">
                Category
              </Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y divide-gray-200">
              {userPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Table.Cell className="hidden lg:table-cell whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="hidden md:table-cell">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="h-12 w-20 object-cover rounded"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="space-y-2">
                      <Link
                        to={`/post/${post.slug}`}
                        className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600"
                      >
                        {post.title}
                      </Link>
                      <div className="lg:hidden text-xs text-gray-500">
                        {new Date(post.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="hidden sm:table-cell text-sm text-gray-500">
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/dashboard?tab=update-post&id=${post._id}`}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-full"
                      >
                        <HiPencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(post._id);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Show more button */}
          {showMore && (
            <button
              onClick={handleShowMore}
              disabled={loadingMore}
              className="w-full text-teal-500 self-center text-sm py-7 flex items-center justify-center"
            >
              {loadingMore ? (
                <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                "Show more"
              )}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No posts found</p>
        </div>
      )}

      <Modal
        show={showModal}
        size="md"
        popup
        onClose={() => setShowModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, delete it
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
