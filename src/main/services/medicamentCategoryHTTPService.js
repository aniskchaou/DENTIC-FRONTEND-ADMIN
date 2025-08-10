import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicamentCayegory = () => {
    return http.get(`${BASE_URL}/medicament-categories`)
}
const createMedicamentCayegory = data => {
    return http.post(`${BASE_URL}/medicament-categories`, data);
};

const editMedicamentCayegory = (id, data) => {
    return http.put(`${BASE_URL}/medicament-categories/${id}`, data);
};

const removeMedicamentCayegory = id => {
    return http.delete(`${BASE_URL}/medicament-categories/${id}`);
};

const getMedicamentCayegoryById = id => {
    return http.get(`${BASE_URL}/medicament-categories/${id}`);
};

export default {
    getMedicamentCayegoryById,
    getAllMedicamentCayegory,
    createMedicamentCayegory,
    editMedicamentCayegory,
    removeMedicamentCayegory
};