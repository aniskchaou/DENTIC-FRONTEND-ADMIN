import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCertificationTemplate = () => {
    return http.get(`${BASE_URL}/certificate-templates`)
}
const createCertificationTemplate = data => {
    return http.post(`${BASE_URL}/certificate-templates`, data);
};

const editCertificationTemplate = (id, data) => {
    return http.put(`${BASE_URL}/certificate-templates/${id}`, data);
};

const removeCertificationTemplate = id => {
    return http.delete(`${BASE_URL}/certificate-templates/${id}`);
};

export default {
    getAllCertificationTemplate,
    createCertificationTemplate,
    editCertificationTemplate,
    removeCertificationTemplate
};