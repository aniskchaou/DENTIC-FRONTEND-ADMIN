import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicamentManufacture = () => {
    return http.get(`${BASE_URL}/medicament-manufactures`)
}
const createMedicamentManufacture = data => {
    return http.post(`${BASE_URL}/medicament-manufactures`, data);
};

const editMedicamentManufacture = (id, data) => {
    return http.put(`${BASE_URL}/medicament-manufactures/${id}`, data);
};

const removeMedicamentManufacture = id => {
    return http.delete(`${BASE_URL}/medicament-manufactures/${id}`);
};

export default {
    getAllMedicamentManufacture,
    createMedicamentManufacture,
    editMedicamentManufacture,
    removeMedicamentManufacture
};