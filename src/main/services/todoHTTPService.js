import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllToDo = () => {
    return http.get(`${BASE_URL}/api/todo`)
}
const createToDo = data => {
    return http.post(`${BASE_URL}/api/todo`, data);
};

const editToDo = (id, data) => {
    return http.put(`${BASE_URL}/api/todo/${id}`, data);
};

const removeToDo = id => {
    return http.delete(`${BASE_URL}/api/todo/${id}`);
};

export default {
    getAllToDo,
    createToDo,
    editToDo,
    removeToDo
};