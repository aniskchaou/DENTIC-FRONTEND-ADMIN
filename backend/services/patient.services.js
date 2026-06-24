const {Patient} = require("../models/patient.models");

exports.getCount = (req, res) => {
    Patient.count()
        .then(data => {
            res.send({ 'patient': data })
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}

exports.searchPatient = (patient, req, res) => {
    Patient.findAll({ where: { namepatient: patient } })
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

exports.findAllPatients = (res) => {

    Patient.findAll()
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

exports.createPatient = (patient, res) => {
    // Save user in the database
    Patient.create(patient)
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

exports.findPatientById = (id, res) => {
    Patient.findByPk(id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving User with id=" + id
            });
        });
}

exports.deletePatientById = (id, res) => {
    Patient.destroy({
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

exports.updatePatient = (id, req, res) => {
    Patient.update(req.body, {
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

exports.deleteAllPatients = (req, res) => {
    Patient.destroy({
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


exports.getPatientByDate = (res) => {

    Patient.findAll()
        .then(data => {


            var dates = []
            var amounts = []
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            data.forEach(function (element) {
                //const d = new Date(element.birth)

                //  var dateBirth = new Date(element.birth)
                var age = 2022 - element.birth.getFullYear()
                console.log(element.birth.getMonth())
                //  dates.push(monthNames[element.birth.getMonth()])
                amounts.push(age)


            });



            const response = {
                labels: monthNames,
                datasets: [
                    {
                        label: 'Patients',
                        data: amounts,
                        borderColor: 'rgba(255, 99, 132, 0.5)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    }
                ],
            };
            res.send(response);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });
}