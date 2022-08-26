import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMessage = () => {
    return http.get(`${BASE_URL}/api/message`)
}
const createMessage = data => {
    return http.post(`${BASE_URL}/api/message`, data);
};

const editMessage = (id, data) => {
    return http.put(`${BASE_URL}/api/message/${id}`, data);
};

const removeMessage = id => {
    return http.delete(`${BASE_URL}/api/message/${id}`);
};

export default {
    getAllMessage,
    createMessage,
    editMessage,
    removeMessage
};