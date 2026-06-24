
const Preference = require("../models/preference.models");

exports.findAllPreferences = (condition) => {

    Preference.findAll({ where: condition })
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

exports.createPreference = (user) => {
    // Save user in the database
    Preference.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Preference."
            });
        });
}

exports.findPreferenceById = (id) => {
    Preference.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Preference with id=" + id
            });
        });
}

exports.deletePreferenceById = (id, res) => {
    Preference.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Preference was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete Preference with id=${id}. Maybe Preference was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Preference with id=" + id
            });
        });
}

exports.updatePreference = (id, req) => {
    Preference.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Preference was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Preference with id=${id}. Maybe Preference was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Preference with id=" + id
            });
        });
}

exports.deleteAllPreferences = () => {
    Preference.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} Preference were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}