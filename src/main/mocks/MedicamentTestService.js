const _medicament = [{ "medicine_name": "Euphytose", "company_name": "pfizer", "group_name": "Oud-Turnhout", "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." }]

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