import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiEye,
  HiOutlineExclamationCircle,
  HiTrash,
  HiUsers,
  HiUserAdd,
  HiMail,
  HiCalendar,
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiCheckCircle,
  HiXCircle,
} from "react-icons/hi";
import { FiShield } from "react-icons/fi";
import { ShieldIcon } from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";
import userService from "../../services/userService";

const DashUsers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await userService.getUsers();
        if (res.success) {
          setUsers(res.data.users);
          if (res.data.users.length < 9) {
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
      const res = await userService.getUsers(startIndex);
      if (res.success) {
        setUsers((prev) => [...prev, ...res.data.users]);
        if (res.data.users.length < 9) {
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
      const res = await userService.deleteUser(userIdToDelete);
      if (res.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
        // showToast("User account deleted successfully", "success");
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleViewUserDetails = (userId) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.isAdmin) ||
      (filterRole === "user" && !user.isAdmin);
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter((user) => user.isAdmin).length;
  const regularUsersCount = users.filter((user) => !user.isAdmin).length;

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
                User Management
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Monitor and manage your community members
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <HiUserAdd className="w-5 h-5" />
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl">
                <HiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {users.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Users
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {adminCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Administrators
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl">
                <HiUserAdd className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">
                  {regularUsersCount}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Regular Users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-2">
              <HiFilter className="text-gray-500 w-5 h-5" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Users</option>
                <option value="admin">Administrators</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {currentUser.isAdmin && filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user, index) => (
              <div
                key={user._id}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* User Avatar and Basic Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-indigo-300 dark:group-hover:ring-indigo-700 transition-all duration-300"
                      />
                      {user.isAdmin && (
                        <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg">
                          <ShieldIcon className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className="text-lg font-bold text-gray-900 dark:text-white truncate cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300"
                          onClick={() => handleViewUserDetails(user._id)}
                        >
                          {user.username}
                        </h3>
                        {user.isAdmin ? (
                          <HiCheckCircle
                            className="w-5 h-5 text-emerald-500"
                            title="Administrator"
                          />
                        ) : (
                          <HiXCircle
                            className="w-5 h-5 text-gray-400"
                            title="Regular User"
                          />
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <HiMail className="w-4 h-4" />
                          <span className="truncate">{user.email}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <HiCalendar className="w-4 h-4" />
                          <span>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.isAdmin
                              ? "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300"
                              : "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300"
                          }`}
                        >
                          {user.isAdmin ? "Administrator" : "User"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Stats */}
                  <div className="hidden lg:flex items-center gap-6 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.postCount || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Posts
                      </div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.commentCount || 0}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Comments
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewUserDetails(user._id)}
                      className="p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-all duration-300 hover:scale-110"
                      title="View Details"
                    >
                      <HiEye className="w-5 h-5" />
                    </button>

                    {user._id !== currentUser._id && (
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setUserIdToDelete(user._id);
                        }}
                        className="p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-all duration-300 hover:scale-110"
                        title="Delete User"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Show More Button */}
            {showMore && (
              <div className="flex justify-center">
                <button
                  onClick={handleShowMore}
                  disabled={loadingMore}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </div>
                  ) : (
                    "Load More Users"
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
            <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl inline-block mb-4">
              <HiUsers className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have joined your community yet"}
            </p>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20 dark:border-gray-700/20">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 rounded-2xl inline-block mb-6">
                  <HiOutlineExclamationCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Delete User Account
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Are you sure you want to delete this user account? This action
                  cannot be undone and will remove all their posts and comments.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleDeleteUser}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        <UserDetailsModal
          isOpen={isUserModalOpen}
          userId={selectedUserId}
          onClose={() => {
            setIsUserModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      </div>
    </div>
  );
};

export default DashUsers;
