import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicament = () => {
    return http.get(`${BASE_URL}/medicaments`)
}

const getMedicamentByDate = () => {
    return http.get(`${BASE_URL}/medicaments/analytics`)
}
const createMedicament = data => {
    return http.post(`${BASE_URL}/medicaments`, data);
};

const editMedicament = (id, data) => {
    return http.put(`${BASE_URL}/medicaments/${id}`, data);
};

const removeMedicament = id => {
    return http.delete(`${BASE_URL}/medicaments/${id}`);
};
const getCount = () => {
    return http.get(`${BASE_URL}/medicaments/count`)
}
export default {
    getAllMedicament,
    createMedicament,
    editMedicament,
    getCount,
    getMedicamentByDate,
    removeMedicament
};