const _patient = []

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