import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMessage = () => {
    return http.get(`${BASE_URL}/messages`)
}

const getCount = () => {
    return http.get(`${BASE_URL}/messages/count`)
}
const createMessage = data => {
    return http.post(`${BASE_URL}/messages`, data);
};

const editMessage = (id, data) => {
    return http.put(`${BASE_URL}/messages/${id}`, data);
};

const removeMessage = id => {
    return http.delete(`${BASE_URL}/messages/${id}`);
};

export default {
    getAllMessage,
    createMessage,
    editMessage,
    removeMessage,
    getCount
};