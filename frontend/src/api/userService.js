import axiosInstance from "./axiosInstance";

// Get user profile by username
export const getUserProfileByUsername = async (username) => {
    try {
        const res = await axiosInstance.get(`/users/getuser/${username}`);
        return res.data;
    } catch (error) {
        return error;
    }
};
