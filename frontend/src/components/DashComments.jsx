import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Loading from "./Loading";
import { useToast } from "../context/ToastContext";
import UserDetailsModal from "./UserDetailsModal";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const { showToast } = useToast();

  const handleApiResponse = async (response) => {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  };

  const fetchPostAndUserDetails = async (comments) => {
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        let postTitle = "Untitled Post";
        let postCategory = "Uncategorized";
        try {
          const postRes = await fetch(`/api/post/getpost/${comment.postId}`);
          if (postRes.ok) {
            const postData = await postRes.json();
            postTitle = postData.title || postTitle;
            postCategory = postData.category || postCategory;
          }
        } catch (postError) {
          console.error(
            `Error fetching post for comment ${comment._id}:`,
            postError
          );
        }

        let username = "Unknown User";
        try {
          const userRes = await fetch(`/api/user/getuser/${comment.userId}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            username = userData.username || username;
          }
        } catch (userError) {
          console.error(
            `Error fetching user for comment ${comment._id}:`,
            userError
          );
        }

        return {
          ...comment,
          postTitle,
          postCategory,
          username,
        };
      })
    );
    return enrichedComments;
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getcomments`);
        const data = await handleApiResponse(res);

        console.log("Fetch comments response:", data);

        if (data.success === false) {
          console.error("API reported failure:", data);
          showToast("Failed to load comments", "error");
        } else {
          const enrichedComments = await fetchPostAndUserDetails(data.comments);
          setComments(enrichedComments);

          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        showToast("Failed to load comments", "error");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      setLoadingMore(true);
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await handleApiResponse(res);

      if (data.success) {
        const enrichedComments = await fetchPostAndUserDetails(data.comments);
        setComments((prev) => [...prev, ...enrichedComments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } else {
        showToast("Failed to load more comments", "error");
      }
    } catch (error) {
      console.error("Error loading more comments:", error);
      showToast("Failed to load more comments", "error");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await handleApiResponse(res);

      if (data.success) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        showToast("Comment deleted successfully", "success");
      } else {
        showToast(data.message || "Failed to delete comment", "error");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      showToast("Failed to delete comment", "error");
    }
  };

  const handleViewUserDetails = (userId) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {loading ? (
        <Loading />
      ) : currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Number of likes</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>{comment.postTitle}</Table.Cell>
                  <Table.Cell>{comment.postCategory}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleViewUserDetails(comment.userId)}
                      className="text-blue-500 hover:underline cursor-pointer"
                    >
                      {comment.username}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
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
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUserId(null);
        }}
        userId={selectedUserId}
      />
    </div>
  );
}
