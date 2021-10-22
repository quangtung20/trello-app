import axios from "axios";
import { API_ROOT } from "../../ultilities/constants";
export const fetchBoardDetails = async (id) => {
    const request = await axios.get(`${API_ROOT}/v1/api/boards/${id}`);
    return request.data;
}