import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getOpeningHourPage = () => {
    return http.get(`${BASE_URL}/api/frontoffice/openinghours`)
}

const editOpeningHourPage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/openinghours/${id}`, data);
};


const getBlogPage = () => {
    return http.get(`${BASE_URL}/api/frontoffice/blogs`)
}

const editBlogPage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/blogs/${id}`, data);
};


const getHomePage = () => {
    return http.get(`${BASE_URL}/api/frontoffice/homepage`)
}

const editHomePage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/homepage/${id}`, data);
};


const getServicePage = () => {
    return http.get(`${BASE_URL}/api/frontoffice/services`)
}

const editServicePage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/services/${id}`, data);
};


const getContactPage = () => {
    return http.get(`${BASE_URL}/api/frontoffice`)
}

const editContactPage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/${id}`, data);
};



export default {
    getOpeningHourPage,
    editContactPage,
    getContactPage,
    editServicePage,
    getServicePage,
    editOpeningHourPage,
    editBlogPage,
    getHomePage,
    editHomePage,
    getBlogPage
};