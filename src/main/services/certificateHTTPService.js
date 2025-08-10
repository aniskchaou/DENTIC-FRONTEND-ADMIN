import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllCertificate = () => {
    return http.get(`${BASE_URL}/certificates`)
}
const createCertificate = data => {
    return http.post(`${BASE_URL}/certificates`, data);
};

const editCertificate = (id, data) => {
    return http.put(`${BASE_URL}/certificates/${id}`, data);
};

const removeCertificate = id => {
    return http.delete(`${BASE_URL}/certificates/${id}`);
};

const removeAllCertificates = id => {
    return http.delete(`${BASE_URL}/certificates`);
};


const getCount = () => {
    return http.get(`${BASE_URL}/certificates/count`)
}


export default {
    getAllCertificate,
    createCertificate,
    editCertificate,
    removeCertificate,
    getCount,
    removeAllCertificates
};