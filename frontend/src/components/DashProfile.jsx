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
import { CircularProgressbar } from "react-circular-progressbar";
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
    <div className="max-w-xl mx-auto p-6 w-full">
      <Card className="w-full">
        <div className="flex flex-col items-center pb-6">
          <div className="relative mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={filePickerRef}
              hidden
            />
            <div
              className="w-32 h-32 relative cursor-pointer group"
              onClick={() => filePickerRef.current.click()}
            >
              {imageFileUploadProgress && imageFileUploading && (
                <div className="absolute inset-0 z-10">
                  <CircularProgressbar
                    value={imageFileUploadProgress || 0}
                    text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                      root: { width: "100%", height: "100%" },
                      path: {
                        stroke: `rgba(62, 152, 199, ${
                          imageFileUploadProgress / 100
                        })`,
                      },
                    }}
                  />
                </div>
              )}
              <img
                src={
                  imageFileUrl || currentUser.profilePicture || defaultAvatar
                }
                alt="User profile"
                className={`w-32 h-32 rounded-full object-cover border-4 border-gray-300 group-hover:opacity-70 transition-opacity ${
                  imageFileUploadProgress && imageFileUploadProgress < 100
                    ? "opacity-60"
                    : ""
                }`}
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <HiUpload className="text-white text-2xl" />
              </div>
            </div>
          </div>

          {imageFileUploadError && (
            <Alert
              color="failure"
              className="mt-2 w-full"
              onDismiss={() => setImageFileUploadError(null)}
            >
              {imageFileUploadError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 mt-4"
          >
            <div>
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                type="text"
                placeholder="Username"
                defaultValue={currentUser.username}
                onChange={handleChange}
                addon={<HiPencil />}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                placeholder="Email"
                defaultValue={currentUser.email}
                disabled
              />
            </div>

            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading || imageFileUploading || !hasChanges}
              className="w-full flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <HiRefresh className="h-5 w-5 animate-spin mr-2" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <HiUserCircle className="h-5 w-5 mr-2" />
                  <span>Update Profile</span>
                </>
              )}
            </Button>
          </form>

          {(updateUserSuccess || updateUserError || error) && (
            <div className="mt-4 w-full space-y-2">
              {updateUserSuccess && (
                <Alert
                  color="success"
                  onDismiss={() => setUpdateUserSuccess(null)}
                >
                  {updateUserSuccess}
                </Alert>
              )}
              {updateUserError && (
                <Alert
                  color="failure"
                  onDismiss={() => setUpdateUserError(null)}
                >
                  {updateUserError}
                </Alert>
              )}
            </div>
          )}

          {currentUser.authProvider === "local" && <PasswordUpdateSection />}

          <div className="flex justify-between w-full mt-6 space-x-4">
            <Tooltip content="Delete Account">
              <Button
                color="failure"
                onClick={() => setShowModal(true)}
                className="flex-1"
              >
                <HiTrash className="mr-2" /> Delete Account
              </Button>
            </Tooltip>
            <Tooltip content="Sign Out">
              <Button color="light" onClick={handleSignout} className="flex-1">
                <HiLogout className="mr-2" /> Sign Out
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
