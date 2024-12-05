import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiEye, HiOutlineExclamationCircle, HiTrash } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";
import Loading from "./Loading";
import { useToast } from "../context/ToastContext";
import UserDetailsModal from "./UserDetailsModal";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      setLoadingMore(true);
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
        showToast("User account deleted successfully", "success");
      } else {
        console.log(data.message);
        showToast("Failed to delete user account. Please try again.", "error");
      }
    } catch (error) {
      console.log(error.message);
      showToast("Failed to delete user account. Please try again.", "error");
    }
  };

  const handleViewUserDetails = (userId) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        ) : currentUser.isAdmin && users.length > 0 ? (
          <>
            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell className="hidden md:table-cell">Date created</Table.HeadCell>
                  <Table.HeadCell className="hidden sm:table-cell">User image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell className="hidden md:table-cell">Email</Table.HeadCell>
                  <Table.HeadCell className="hidden sm:table-cell">Admin</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {users.map((user) => (
                    <Table.Row 
                      key={user._id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Table.Cell className="hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell">
                        <img
                          src={user.profilePicture}
                          alt={user.username}
                          className="w-10 h-10 object-cover rounded-full mx-auto"
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex items-center space-x-2">
                          <img
                            src={user.profilePicture}
                            alt={user.username}
                            className="w-8 h-8 object-cover rounded-full sm:hidden"
                          />
                          <span
                            onClick={() => handleViewUserDetails(user._id)}
                            className="text-blue-500 hover:underline cursor-pointer truncate"
                          >
                            {user.username}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="hidden md:table-cell truncate">
                        {user.email}
                      </Table.Cell>
                      <Table.Cell className="hidden sm:table-cell">
                        {user.isAdmin ? (
                          <FaCheck className="text-green-500 mx-auto" />
                        ) : (
                          <FaTimes className="text-red-500 mx-auto" />
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleViewUserDetails(user._id)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <HiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setShowModal(true);
                              setUserIdToDelete(user._id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <HiTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                 </Table.Body>
              </Table>
            </div>
  
            {/* Show More Button */}
            {showMore && (
              <div className="flex justify-center p-4">
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loadingMore ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Show More
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            You have no users yet!
          </div>
        )}
      </div>
  
      {/* Delete Confirmation Modal */}
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
              Are you sure you want to delete this user?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                color="failure" 
                onClick={handleDeleteUser}
                className="w-full sm:w-auto"
              >
                Yes, I'm sure
              </Button>
              <Button 
                color="gray" 
                onClick={() => setShowModal(false)}
                className="w-full sm:w-auto"
              >
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
