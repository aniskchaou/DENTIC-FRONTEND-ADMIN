import http from "../../libraries/axios/axios";
import BASE_URL from "../urls/urls";

const getAllTestimonials = () => {
    return http.get(`${BASE_URL}/api/testimonials`)
}
const createTestimonials = data => {
    return http.post(`${BASE_URL}/api/testimonials`, data);
};

const editTestimonials = (id, data) => {
    return http.put(`${BASE_URL}/api/testimonials/${id}`, data);
};

const removeTestimonials = id => {
    return http.delete(`${BASE_URL}/api/testimonials/${id}`);
};

const removeAllTestimonialss = id => {
    return http.delete(`${BASE_URL}/api/testimonials`);
};





export default {
    getAllTestimonials,
    createTestimonials,
    editTestimonials,
    removeTestimonials,
    removeAllTestimonialss
};