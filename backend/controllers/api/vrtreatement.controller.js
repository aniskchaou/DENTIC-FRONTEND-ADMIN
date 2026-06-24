const {
    findAllVRTreatments,
    findVRTreatmentById,
    createVRTreatment,
    updateVRTreatment,
    deleteVRTreatmentById,
    deleteAllVRTreatments
} = require("../../services/vrtreatement.services");

exports.create = (req, res) => {
    if (!req.body.patientId || !req.body.simulationName) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    createVRTreatment(req.body, res);
};

exports.findAll = (req, res) => {
    findAllVRTreatments(null, res);
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findVRTreatmentById(id, res);
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateVRTreatment(id, req, res);
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteVRTreatmentById(id, res);
};

exports.deleteAll = (req, res) => {
    deleteAllVRTreatments(res);
};