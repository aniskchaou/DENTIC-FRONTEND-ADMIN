import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllTestLab = () => {
    return http.get(`${BASE_URL}/api/labtest`)
}
const createTestLab = data => {
    return http.post(`${BASE_URL}/api/labtest`, data);
};

const editTestLab = (id, data) => {
    return http.put(`${BASE_URL}/api/labtest/${id}`, data);
};

const removeTestLab = id => {
    return http.delete(`${BASE_URL}/api/labtest/${id}`);
};

export default {
    getAllTestLab,
    createTestLab,
    editTestLab,
    removeTestLab
};