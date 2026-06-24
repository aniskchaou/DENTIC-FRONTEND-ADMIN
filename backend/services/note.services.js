
const Note = require("../models/note.models");

exports.findAllNotes = (res) => {

    Note.findAll()
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

exports.createNote = (income) => {
    Note.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Note."
            });
        });
}

exports.findNoteById = (id) => {
    Note.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Note with id=" + id
            });
        });
}

exports.deleteNoteById = (id, res) => {
    Note.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Note was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Note with id=${id}. Maybe Note was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Note with id=" + id
            });
        });
}

exports.updateNote = (id, req) => {
    Note.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Note was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Note with id=${id}. Maybe Note was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Note with id=" + id
            });
        });
}

exports.deleteAllNotes = () => {
    Note.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Note were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}