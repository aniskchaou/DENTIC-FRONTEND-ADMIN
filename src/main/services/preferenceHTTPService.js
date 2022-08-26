import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPreference = () => {
    return http.get(`${BASE_URL}/api/preference`)
}
const createPreference = data => {
    return http.post(`${BASE_URL}/api/preference`, data);
};

const editPreference = (id, data) => {
    return http.put(`${BASE_URL}/api/preference/${id}`, data);
};

const removePreference = id => {
    return http.delete(`${BASE_URL}/api/preference/${id}`);
};

export default {
    getAllPreference,
    createPreference,
    editPreference,
    removePreference
};