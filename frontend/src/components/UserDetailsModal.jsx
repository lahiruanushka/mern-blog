import React, { useState, useEffect } from "react";
import { Modal, Badge, Spinner, Card, Avatar } from "flowbite-react";
import {
  HiUser,
  HiMail,
  HiIdentification,
  HiClock,
  HiShieldCheck,
  HiStatusOnline,
  HiInformationCircle,
} from "react-icons/hi";
import { useToast } from "../context/ToastContext";

const UserDetailsModal = ({ isOpen, onClose, userId }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!isOpen || !userId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/user/getuser/${userId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        showToast("Failed to load user details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [isOpen, userId, showToast]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="2xl" className="p-2 sm:p-4">
      <Modal.Header className="text-lg sm:text-xl">
        User Profile Details
      </Modal.Header>
      <Modal.Body className="p-3 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="info" />
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <Avatar
                img={userData.profilePicture}
                rounded
                size="xl"
                status={
                  userData.accountStatus === "active" ? "online" : "offline"
                }
                className="self-center"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {userData.username}
                </h2>
                <p className="text-gray-500 flex items-center justify-center sm:justify-start">
                  <HiMail className="mr-2" />
                  {userData.email}
                </p>
              </div>
            </div>

            {/* User Information Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Account Status Card */}
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HiStatusOnline className="text-gray-500" />
                    <span className="font-semibold">Account Status</span>
                  </div>
                  <Badge
                    color={
                      userData.accountStatus === "active"
                        ? "success"
                        : "failure"
                    }
                  >
                    {userData.accountStatus}
                  </Badge>
                </div>
              </Card>

              {/* Admin Status Card */}
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <HiShieldCheck className="text-gray-500" />
                    <span className="font-semibold">Admin Privileges</span>
                  </div>
                  <Badge color={userData.isAdmin ? "success" : "gray"}>
                    {userData.isAdmin ? "Elevated Access" : "Standard User"}
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Security and Account Information */}
            <Card className="w-full overflow-x-auto">
              <div className="space-y-4">
                {/* Account Created */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <HiClock className="text-gray-500" />
                    <span className="font-semibold">Account Created</span>
                  </div>
                  <span className="text-sm sm:text-base">
                    {formatDate(userData.createdAt)}
                  </span>
                </div>

                {/* Authentication Provider */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <HiIdentification className="text-gray-500" />
                    <span className="font-semibold">
                      Authentication Provider
                    </span>
                  </div>
                  <span className="text-sm sm:text-base">
                    {userData.authProvider || "Local Authentication"}
                  </span>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-2">
                    <HiInformationCircle className="text-gray-500" />
                    <span className="font-semibold">
                      Two-Factor Authentication
                    </span>
                  </div>
                  <Badge
                    color={
                      userData.securitySettings?.twoFactorEnabled
                        ? "success"
                        : "gray"
                    }
                  >
                    {userData.securitySettings?.twoFactorEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>No user data available</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default UserDetailsModal;
