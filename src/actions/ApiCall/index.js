import axios from "axios";
import { API_ROOT } from "../../ultilities/constants";

export const fetchBoardDetails = async (id) => {
    const request = await axios.get(`${API_ROOT}/v1/api/boards/${id}`);
    return request.data;
}

export const createNewColumn = async (data) => {
    const request = await axios.post(`${API_ROOT}/v1/api/columns`, data);
    return request.data;
}

export const createNewCard = async (data) => {
    const request = await axios.post(`${API_ROOT}/v1/api/cards`, data);
    return request.data;
}

// update or remove column
export const updateColumn = async (id, data) => {
    const request = await axios.put(`${API_ROOT}/v1/api/columns/${id}`, data);
    return request.data;
}