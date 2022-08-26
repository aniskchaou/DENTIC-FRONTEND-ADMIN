import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllLabTest = () => {
    return http.get(`${BASE_URL}/api/labtest`)
}
const createLabTest = data => {
    return http.post(`${BASE_URL}/api/labtest`, data);
};

const editLabTest = (id, data) => {
    return http.put(`${BASE_URL}/api/labtest/${id}`, data);
};

const removeLabTest = id => {
    return http.delete(`${BASE_URL}/api/labtest/${id}`);
};

export default {
    getAllLabTest,
    createLabTest,
    editLabTest,
    removeLabTest
};