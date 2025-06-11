import axios from "axios";

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Add a request interceptor to include the token in all requests
apiInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiInstance;