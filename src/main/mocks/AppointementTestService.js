const _appointement = []

const getAll = () => {
    return _appointement;
};

const get = id => {
    return _appointement.find(item => item.id === id);
};

const create = (data) => {
    _appointement.push(data);
};

const update = (old, data) => {

    var foundIndex = _appointement.findIndex(item => item === old);
    _appointement[foundIndex] = data;
};

const remove = id => {
    _appointement.splice(id, 1);
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