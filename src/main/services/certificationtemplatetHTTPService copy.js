import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCertificationTemplate = () => {
    return http.get(`${BASE_URL}/api/certificatetemplate`)
}
const createCertificationTemplate = data => {
    return http.post(`${BASE_URL}/api/certificatetemplate`, data);
};

const editCertificationTemplate = (id, data) => {
    return http.put(`${BASE_URL}/api/certificatetemplate/${id}`, data);
};

const removeCertificationTemplate = id => {
    return http.delete(`${BASE_URL}/api/certificatetemplate/${id}`);
};

export default {
    getAllCertificationTemplate,
    createCertificationTemplate,
    editCertificationTemplate,
    removeCertificationTemplate
};