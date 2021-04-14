const _patient = [{
    "patient_id": "123423", "name": "Benoît Grandbois",
    "phone": "03.39.93.54.49", "sexe": "Homme", "venue": "", "phone": "",
    "blood_group": "", "address": "", "email": "", "date": "", "old": ""
}]

const getAll = () => {
    return _patient;
};

const get = id => {
    return _patient.find(item => item.id === id);
};

const create = (data) => {
    _patient.push(data);
};

const update = (old, data) => {

    var foundIndex = _patient.findIndex(item => item === old);
    _patient[foundIndex] = data;
};

const remove = id => {
    _patient.splice(id, 1);
};

const removeAll = () => {

};

const findByTitle = title => {

};

export default {
    getAll,
    get,
    create,
    update,
    remove,
    removeAll,
    findByTitle
};