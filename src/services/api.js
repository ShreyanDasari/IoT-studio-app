import axios from 'axios';
const api = axios.create({
    baseURL: 'http://127.0.0.1:5001',
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add response interceptor to handle errors consistently
api.interceptors.response.use((response) => response, (error) => {
    // Enhanced error handling to provide more specific error messages
    if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check if the server is running and accessible.');
    }
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(errorMessage);
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export const login = async (emailOrUsername, password, sessionTime) => {
    const response = await api.post('/auth/signin', {
        username_or_email: emailOrUsername,
        password: password,
        session_required: sessionTime
    });
    if (!response.data?.token) {
        throw new Error('Invalid response from server');
    }
    return response.data;
};
export const logout = async () => {
    localStorage.removeItem('auth_token');
};
export const getAllConnections = async () => {
    const response = await api.get('/services/IotConnect/getAllIoTConnections');
    return response.data;
};
export const getConnectionById = async (id) => {
    const response = await api.get(`/services/IotConnect/getConnectionById/${id}`);
    return response.data;
};
export default api;
