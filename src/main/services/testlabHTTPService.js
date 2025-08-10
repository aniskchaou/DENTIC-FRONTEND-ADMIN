import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllTestLab = () => {
    return http.get(`${BASE_URL}/labtests`)
}
const createTestLab = data => {
    return http.post(`${BASE_URL}/labtests`, data);
};

const editTestLab = (id, data) => {
    return http.put(`${BASE_URL}/labtests/${id}`, data);
};

const removeTestLab = id => {
    return http.delete(`${BASE_URL}/labtests/${id}`);
};

export default {
    getAllTestLab,
    createTestLab,
    editTestLab,
    removeTestLab
};