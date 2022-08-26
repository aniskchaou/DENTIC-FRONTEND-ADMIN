import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllInvoice = () => {
    return http.get(`${BASE_URL}/api/invoice`)
}
const createInvoice = data => {
    return http.post(`${BASE_URL}/api/invoice`, data);
};

const editInvoice = (id, data) => {
    return http.put(`${BASE_URL}/api/invoice/${id}`, data);
};

const removeInvoice = id => {
    return http.delete(`${BASE_URL}/api/invoice/${id}`);
};

export default {
    getAllInvoice,
    createInvoice,
    editInvoice,
    removeInvoice
};