import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllAppointement = () => {
    return http.get(`${BASE_URL}/api/appointement`)
}
const createAppointement = data => {
    return http.post(`${BASE_URL}/api/appointement`, data);
};

const editAppointement = (id, data) => {
    return http.put(`${BASE_URL}/api/appointement/${id}`, data);
};

const removeAppointement = id => {
    return http.delete(`${BASE_URL}/api/appointement/${id}`);
};
const getCount = () => {
    return http.get(`${BASE_URL}/api/appointement/count`)
}

export default {
    getAllAppointement,
    createAppointement,
    editAppointement,
    getCount,
    removeAppointement
};