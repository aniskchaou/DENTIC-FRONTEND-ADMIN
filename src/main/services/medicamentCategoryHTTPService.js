import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllMedicamentCayegory = () => {
    return http.get(`${BASE_URL}/api/medicamentcategory`)
}
const createMedicamentCayegory = data => {
    return http.post(`${BASE_URL}/api/medicamentcategory`, data);
};

const editMedicamentCayegory = (id, data) => {
    return http.put(`${BASE_URL}/api/medicamentcategory/${id}`, data);
};

const removeMedicamentCayegory = id => {
    return http.delete(`${BASE_URL}/api/medicamentcategory/${id}`);
};

const getMedicamentCayegoryById = id => {
    return http.get(`${BASE_URL}/api/medicamentcategory/${id}`);
};

export default {
    getMedicamentCayegoryById,
    getAllMedicamentCayegory,
    createMedicamentCayegory,
    editMedicamentCayegory,
    removeMedicamentCayegory
};