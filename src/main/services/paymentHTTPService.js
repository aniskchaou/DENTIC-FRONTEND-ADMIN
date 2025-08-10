import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllPayment = () => {
    return http.get(`${BASE_URL}/payments`)
}
const createPayment = data => {
    return http.post(`${BASE_URL}/payments`, data);
};

const editPayment = (id, data) => {
    return http.put(`${BASE_URL}/payments/${id}`, data);
};

const removePayment = id => {
    return http.delete(`${BASE_URL}/payments/${id}`);
};

export default {
    getAllPayment,
    createPayment,
    editPayment,
    removePayment
};