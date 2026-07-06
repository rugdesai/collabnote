import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Automatically attach JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const updateNote = (
  id: string,
  data: {
    title: string;
    content: string;
  }
) => api.put(`/notes/${id}`, data);

export const deleteNote = (id: string) => {
  return api.delete(`/notes/${id}`);
};

export default api;