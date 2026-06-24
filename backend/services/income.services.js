
const Income = require("../models/income.models");

exports.findAllIncomes = (res) => {

    Income.findAll()
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

exports.createIncome = (income) => {
    Income.create(income)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Income."
            });
        });
}

exports.findIncomeById = (id) => {
    Income.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Income with id=" + id
            });
        });
}

exports.deleteIncomeById = (id, res) => {
    Income.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Income was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Income with id=${id}. Maybe Income was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Income with id=" + id
            });
        });
}

exports.updateIncome = (id, req) => {
    Income.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Income was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Income with id=${id}. Maybe Income was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Income with id=" + id
            });
        });
}

exports.deleteAllIncomes = () => {
    Income.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Income were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}