
const Invoice = require("../models/invoice.models");


exports.findAllInvoices = (res) => {

    Invoice.findAll({})
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

exports.createInvoice = (income,res) => {
    Invoice.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Invoice."
            });
        });
}

exports.findInvoiceById = (id) => {
    Invoice.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Invoice with id=" + id
            });
        });
}

exports.deleteInvoiceById = (id, res) => {
    Invoice.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Invoice was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Invoice with id=${id}. Maybe Invoice was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Invoice with id=" + id
            });
        });
}

exports.updateInvoice = (id, req) => {
    Invoice.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Invoice was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Invoice with id=${id}. Maybe Invoice was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Invoice with id=" + id
            });
        });
}

exports.deleteAllInvoices = () => {
    Invoice.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Invoice were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}

