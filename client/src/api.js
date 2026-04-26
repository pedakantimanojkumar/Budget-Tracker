import axios from "axios";

const api = axios.create({
  baseURL: "https://budget-tracker-api.onrender.com",
});

//  THIS IS THE IMPORTANT PART
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;