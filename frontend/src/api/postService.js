import axiosInstance from "./axiosInstance";

export const getPostsByUserId = async (userId) => {
    try {
        const res = await axiosInstance.get(`/posts/getpostsbyuserid/${userId}`);
        return res.data;
    } catch (error) {
        return error;
    }
};
  