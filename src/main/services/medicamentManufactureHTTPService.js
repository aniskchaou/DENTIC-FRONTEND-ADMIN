import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicamentManufacture = () => {
    return http.get(`${BASE_URL}/api/medicamentmanufacture`)
}
const createMedicamentManufacture = data => {
    return http.post(`${BASE_URL}/api/medicamentmanufacture`, data);
};

const editMedicamentManufacture = (id, data) => {
    return http.put(`${BASE_URL}/api/medicamentmanufacture/${id}`, data);
};

const removeMedicamentManufacture = id => {
    return http.delete(`${BASE_URL}/api/medicamentmanufacture/${id}`);
};

export default {
    getAllMedicamentManufacture,
    createMedicamentManufacture,
    editMedicamentManufacture,
    removeMedicamentManufacture
};