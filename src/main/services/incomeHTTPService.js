import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllIncome = () => {
    return http.get(`${BASE_URL}/incomes`)
}
const createIncome = data => {
    return http.post(`${BASE_URL}/incomes`, data);
};

const editIncome = (id, data) => {
    return http.put(`${BASE_URL}/incomes/${id}`, data);
};

const removeIncome = id => {
    return http.delete(`${BASE_URL}/incomes/${id}`);
};

export default {
    getAllIncome,
    createIncome,
    editIncome,
    removeIncome
};