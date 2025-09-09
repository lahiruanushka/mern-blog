import axiosInstance from "./axiosInstance";

export const getPostsByUserId = async (userId) => {
    try {
        const res = await axiosInstance.get(`/posts/getpostsbyuserid/${userId}`);
        console.log(res.data);
        return res.data;
    } catch (error) {
        return error;
    }
};
  