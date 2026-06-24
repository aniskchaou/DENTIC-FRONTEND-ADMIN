
const ToDo = require("../models/todo.models");

exports.findAllToDos = (res) => {

    ToDo.findAll({})
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

exports.createToDo = (income) => {
    ToDo.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the ToDo."
            });
        });
}

exports.findToDoById = (id) => {
    ToDo.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving ToDo with id=" + id
            });
        });
}

exports.deleteToDoById = (id, res) => {
    ToDo.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ToDo was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete ToDo with id=${id}. Maybe ToDo was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete ToDo with id=" + id
            });
        });
}

exports.updateToDo = (id, req) => {
    ToDo.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "ToDo was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update ToDo with id=${id}. Maybe ToDo was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating ToDo with id=" + id
            });
        });
}

exports.deleteAllToDos = () => {
    ToDo.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} ToDo were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}