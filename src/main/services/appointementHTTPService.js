import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllAppointement = () => {
    return http.get(`${BASE_URL}/appointments`)
}
const createAppointement = data => {
    return http.post(`${BASE_URL}/appointments`, data);
};

const editAppointement = (id, data) => {
    return http.put(`${BASE_URL}/appointments/${id}`, data);
};

const removeAppointement = id => {
    return http.delete(`${BASE_URL}/appointments/${id}`);
};
const getCount = () => {
    return http.get(`${BASE_URL}/appointments/count`)
}

export default {
    getAllAppointement,
    createAppointement,
    editAppointement,
    getCount,
    removeAppointement
};