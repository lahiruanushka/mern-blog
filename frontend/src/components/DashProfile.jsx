import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  TextInput,
  Modal,
  Card,
  Label,
  Tooltip,
} from "flowbite-react";
import {
  HiOutlineExclamationCircle,
  HiPencil,
  HiTrash,
  HiLogout,
  HiUpload,
  HiRefresh,
  HiUserCircle,
} from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
  clearError,
} from "../features/user/userSlice.js";
import defaultAvatar from "/src/assets/default-avatar.png";
import PasswordUpdateSection from "./PasswordUpdateSection.jsx";

const DashProfile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const filePickerRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-hide alerts after 3 seconds if not manually dismissed
  useEffect(() => {
    let timeoutId;
    if (updateUserSuccess || updateUserError || imageFileUploadError || error) {
      timeoutId = setTimeout(() => {
        setUpdateUserSuccess(null);
        setUpdateUserError(null);
        setImageFileUploadError(null);
        dispatch(clearError());
      }, 3000);
    }

    // Cleanup timeout on component unmount or when messages change
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    updateUserSuccess,
    updateUserError,
    imageFileUploadError,
    error,
    dispatch,
  ]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setHasChanges(true);
    }
  };

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    const currentValue = currentUser.username;

    // Check if the username has actually changed
    if (newValue !== currentValue) {
      setFormData({ ...formData, [e.target.id]: newValue });
      setHasChanges(true);
    } else {
      // Remove the field from formData if it's back to the original value
      const { [e.target.id]: removedField, ...rest } = formData;
      setFormData(rest);
      setHasChanges(Object.keys(rest).length > 0 || imageFile !== null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // Validate username only if it's being changed
    if (formData.username) {
      if (formData.username.length < 6) {
        setUpdateUserError("Username must be at least 6 characters");
        return;
      }
      if (/\s/.test(formData.username)) {
        setUpdateUserError("Username cannot contain spaces");
        return;
      }
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully");
        setHasChanges(false);
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card className="w-full">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h2>

          {/* Profile Image Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              className="hidden"
            />
            <div
              className="relative cursor-pointer group"
              onClick={() => filePickerRef.current?.click()}
            >
              <div className="w-36 h-36 rounded-full overflow-hidden relative">
                {imageFileUploadProgress && imageFileUploading && (
                  <div className="absolute inset-0 z-10 bg-gray-900/50 flex items-center justify-center">
                    <div className="text-white text-lg font-semibold">
                      {imageFileUploadProgress}%
                    </div>
                  </div>
                )}
                <img
                  src={
                    imageFileUrl || currentUser.profilePicture || defaultAvatar
                  }
                  alt="Profile"
                  className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-75"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-900/30">
                  <HiUpload className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Upload Error Alert */}
          {imageFileUploadError && (
            <Alert
              color="failure"
              onDismiss={() => setImageFileUploadError(null)}
              className="w-full max-w-md"
            >
              {imageFileUploadError}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <div className="mb-6">
                <Label htmlFor="username" value="Username" />
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <HiPencil className="w-4 h-4 text-gray-500" />
                  </div>
                  <TextInput
                    id="username"
                    type="text"
                    placeholder="Username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="email" value="Email" />
                <TextInput
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={currentUser.email}
                  disabled
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>

              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                disabled={loading || imageFileUploading || !hasChanges}
                className="w-full"
              >
                {loading ? (
                  <>
                    <HiRefresh className="w-4 h-4 mr-2 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <HiUserCircle className="w-4 h-4 mr-2" />
                    <span>Update Profile</span>
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Status Alerts */}
          {(updateUserSuccess || updateUserError || error) && (
            <div className="w-full space-y-3">
              {updateUserSuccess && (
                <Alert
                  color="success"
                  onDismiss={() => setUpdateUserSuccess(null)}
                >
                  {updateUserSuccess}
                </Alert>
              )}
              {(updateUserError || error) && (
                <Alert
                  color="failure"
                  onDismiss={() => setUpdateUserError(null)}
                >
                  {updateUserError || error}
                </Alert>
              )}
            </div>
          )}

          {/* Password Update Section */}
          {currentUser.authProvider === "local" && <PasswordUpdateSection />}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
            <Tooltip content="Delete Account">
              <Button
                color="failure"
                onClick={() => setShowModal(true)}
                className="w-full"
              >
                <HiTrash className="w-4 h-4 mr-2" />
                <span>Delete Account</span>
              </Button>
            </Tooltip>

            <Tooltip content="Sign Out">
              <Button color="light" onClick={handleSignout} className="w-full">
                <HiLogout className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </Tooltip>
          </div>
        </div>
      </Card>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes, I'm sure
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

export default DashProfile;
