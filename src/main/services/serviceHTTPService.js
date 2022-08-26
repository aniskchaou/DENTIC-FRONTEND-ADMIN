import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllService = () => {
    return http.get(`${BASE_URL}/api/service`)
}
const createService = data => {
    return http.post(`${BASE_URL}/api/service`, data);
};

const editService = (id, data) => {
    return http.put(`${BASE_URL}/api/service/${id}`, data);
};

const removeService = id => {
    return http.delete(`${BASE_URL}/api/service/${id}`);
};

export default {
    getAllService,
    createService,
    editService,
    removeService
};