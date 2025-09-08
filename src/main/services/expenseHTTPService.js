import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllExpense = () => {
    return http.get(`${BASE_URL}/expenses`)
}
const createExpense = data => {
    return http.post(`${BASE_URL}/expenses`, data);
};

const editExpense = (id, data) => {
    return http.put(`${BASE_URL}/expenses/${id}`, data);
};

const removeExpense = id => {
    return http.delete(`${BASE_URL}/expenses/${id}`);
};

export default {
    getAllExpense,
    createExpense,
    editExpense,
    removeExpense
};