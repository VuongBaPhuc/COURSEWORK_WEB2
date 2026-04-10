import axios from "axios";

const API = "http://localhost:3000/words";

export const getWords = () => axios.get(API);
export const createWord = (data) => axios.post(API, data);
export const deleteWord = (id) => axios.delete(`${API}/${id}`);
export const updateWord = (id, data) => axios.put(`${API}/${id}`, data);
export const getWord = (id) => axios.get(`${API}/${id}`);