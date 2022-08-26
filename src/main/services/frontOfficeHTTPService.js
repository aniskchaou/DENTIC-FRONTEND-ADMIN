import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getOpeningHourPage = () => {
    return http.get(`${BASE_URL}/api/frontoffice`)
}

const editOpeningHourPage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/${id}`, data);
};


const getBlogPage = () => {
    return http.get(`${BASE_URL}/api/frontoffice`)
}

const editBlogPage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/${id}`, data);
};


const getHomePage = () => {
    return http.get(`${BASE_URL}/api/frontoffice`)
}

const editHomePage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/${id}`, data);
};


const getServicePage = () => {
    return http.get(`${BASE_URL}/api/frontoffice`)
}

const editServicePage = (id, data) => {
    return http.put(`${BASE_URL}/api/frontoffice/${id}`, data);
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