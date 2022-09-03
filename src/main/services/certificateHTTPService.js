import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCertificate = () => {
    return http.get(`${BASE_URL}/api/certificate`)
}
const createCertificate = data => {
    return http.post(`${BASE_URL}/api/certificate`, data);
};

const editCertificate = (id, data) => {
    return http.put(`${BASE_URL}/api/certificate/${id}`, data);
};

const removeCertificate = id => {
    return http.delete(`${BASE_URL}/api/certificate/${id}`);
};

const removeAllCertificates = id => {
    return http.delete(`${BASE_URL}/api/certificate`);
};



export default {
    getAllCertificate,
    createCertificate,
    editCertificate,
    removeCertificate,

    removeAllCertificates
};