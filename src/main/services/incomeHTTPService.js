import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllIncome = () => {
    return http.get(`${BASE_URL}/api/income`)
}
const createIncome = data => {
    return http.post(`${BASE_URL}/api/income`, data);
};

const editIncome = (id, data) => {
    return http.put(`${BASE_URL}/api/income/${id}`, data);
};

const removeIncome = id => {
    return http.delete(`${BASE_URL}/api/income/${id}`);
};

export default {
    getAllIncome,
    createIncome,
    editIncome,
    removeIncome
};