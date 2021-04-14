const _prescription = [{ "prescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }]


const getAll = () => {
    return _prescription;
};

const get = id => {
    return _prescription.find(item => item.id === id);
};

const create = (data) => {
    _prescription.push(data);
};

const update = (old, data) => {

    var foundIndex = _prescription.findIndex(item => item === old);
    _prescription[foundIndex] = data;
};

const remove = id => {
    _prescription.splice(id, 1);
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