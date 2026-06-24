
const Certificate = require("../models/certificate.models");
const {Patient} = require("../models/patient.models");
exports.getCount = (req, res) => {
    Certificate.count()
        .then(data => {
            res.send({ 'certificate': data })
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving users."
            });
        });








}


exports.filterCertificate = (patient, template, req, res) => {
    Certificate.findAll({
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


exports.findAllCertificates = (res) => {
       Certificate.findAll()
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message:
                      err.message || "Some error occurred while retrieving users."
              });
          }); 

    // const certificates = []
    // const p = Patient.findAll()
    // const t = Certificate.findAll()

    // Promise
    //     .all([t, p])
    //     .then(responses => {
    //         console.log(responses[1])
    //         for (const d of responses[0]) {
    //             certificates.push({
    //                 id: d.id,
    //                 date: d.date,
    //                 template: d.template,
    //                 content: d.content,
    //                 patient: responses[1].find(i => i.id == d.patient)?.dataValues?.namepatient,
    //                 createdAt: d.createdAt,
    //                 updatedAt: d.updatedAt
    //             })

    //         }
    //         res.send(certificates);
    //     })
}

exports.createCertificate = (user, res) => {
    Certificate.create(user)
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

exports.findCertificateById = (id,res) => {
    Certificate.findByPk(id)
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

exports.deleteCertificateById = (id, res) => {
    Certificate.destroy({
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

exports.updateCertificate = (id, req, res) => {
    Certificate.update(req.body, {
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

exports.deleteAllCertificates = (res) => {
    Certificate.destroy({
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