import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
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