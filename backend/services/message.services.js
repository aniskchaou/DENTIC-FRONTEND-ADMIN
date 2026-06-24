
const Message = require("../models/message.models");
exports.getCount = (req, res) => {
    Message.count()
        .then(data => {
            res.send({ 'message': data })
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

exports.findAllMessages = (res) => {

    Message.findAll()
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

exports.createMessage = (income, res) => {
    Message.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Message."
            });
        });
}

exports.findMessageById = (id) => {
    Message.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Message with id=" + id
            });
        });
}

exports.deleteMessageById = (id, res) => {
    Message.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Message was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Message with id=${id}. Maybe Message was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Message with id=" + id
            });
        });
}

exports.updateMessage = (id, req) => {
    Message.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Message was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Message with id=${id}. Maybe Message was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Message with id=" + id
            });
        });
}

exports.deleteAllMessages = () => {
    Message.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Message were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}