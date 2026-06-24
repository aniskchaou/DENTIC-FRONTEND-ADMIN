
const Schedule = require("../models/schedule.models");


exports.filterSchedule = (patient, template, req, res) => {
    Schedule.findAll({
        where: {
            patient: patient,
            template: template
        }
    })
        .then(data => {
            console.log(data)
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}


exports.findAllSchedules = (res) => {
    Schedule.findAll()
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

exports.createSchedule = (user, res) => {
    Schedule.create(user)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        });
}

exports.findScheduleById = (id) => {
    Schedule.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            console.log(err)
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
}

exports.deleteScheduleById = (id, res) => {
    Schedule.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete User with id=${id}. Maybe User was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}

exports.updateSchedule = (id, req, res) => {
    Schedule.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
}

exports.deleteAllSchedules = (res) => {
    Schedule.destroy({
        where: {},
        truncate: false
    })
        .then(nums => {
            res.send({ message: `${nums} User were deleted successfully!` });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all tutorials."
            });
        });
}