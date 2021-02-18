const _medicament = []

const getAll = () => {
    return _medicament;
};

const get = id => {
    return _medicament.find(item => item.id === id);
};

const create = (data) => {
    _medicament.push(data);
};

const update = (old, data) => {

    var foundIndex = _medicament.findIndex(item => item === old);
    _medicament[foundIndex] = data;
};

const remove = id => {
    _medicament.splice(id, 1);
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