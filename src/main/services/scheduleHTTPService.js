import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllSchedule = () => {
    return http.get(`${BASE_URL}/api/schedule`)
}
const createSchedule = data => {
    return http.post(`${BASE_URL}/api/schedule`, data);
};

const editSchedule = (id, data) => {
    return http.put(`${BASE_URL}/api/schedule/${id}`, data);
};

const removeSchedule = id => {
    return http.delete(`${BASE_URL}/api/schedule/${id}`);
};

const removeAllSchedules = id => {
    return http.delete(`${BASE_URL}/api/schedule`);
};





export default {
    getAllSchedule,
    createSchedule,
    editSchedule,
    removeSchedule,
    removeAllSchedules
};