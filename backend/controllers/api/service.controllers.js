const { filterService, deleteServiceById, createService, findAllServices, findServiceById, updateService, deleteAllServices } = require("../../services/service.services");
const multer = require("multer");
const fs = require("fs");
const path = require("path");


exports.filterService = (req, res) => {
    const patient = req.params.patient;
    const template = req.params.template;
    filterService(patient, template, req, res)
}

exports.create = (req, res) => {

    createService(req.body, res)
};
/**
 * @swagger
 * /services:
 *   post:
 *     summary: Save request body to a JSON file
 *     tags: [Service]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Body saved to file
 *       500:
 *         description: Failed to write file
 */

exports.saveBodyToFile = (req, res) => {
    const filePath = path.join(__dirname, "../../service-body.json");
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: "Failed to write file", error: err });
        }
        res.send({ message: "Body saved to file", file: filePath });
    });
};
/**
 * @swagger
 * /services:
 *   get:
 *     summary: Read and return the content of the saved JSON file
 *     tags: [Service]
 *     responses:
 *       200:
 *         description: File content returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to read file or invalid JSON
 */
exports.readBodyFromFile = (req, res) => {
    const filePath = path.join(__dirname, "../../service-body.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Failed to read file", error: err });
        }
        try {
            const json = JSON.parse(data);
            res.send(json);
        } catch (parseErr) {
            res.status(500).send({ message: "File content is not valid JSON", error: parseErr });
        }
    });
};
























exports.addImage = (req, res) => {
    console.log("uploading")
    // console.log(req.body)
    // SET STORAGE
    // const fileName = req.body.file[0].name
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'views/assets/uploads/service')
        },
        filename: function (req, file, cb) {
            console.log(file)
            cb(null, file.originalname)
        }
    })

    var upload = multer({ storage: storage }).single('file')

    upload(req, res, function (err) {

        if (err) {

            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            console.log("errrrroeeeee")
            res.send(err)
        }
        else {

            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!")
        }
    })
}

exports.findAll = (req, res) => {
    findAllServices(res)
};

exports.findOne = (req, res) => {
    const id = req.params.id;
    findServiceById(id, res)
};

exports.update = (req, res) => {
    const id = req.params.id;
    updateService(id, req, res)
};

exports.delete = (req, res) => {
    const id = req.params.id;
    deleteServiceById(id, res)
};

exports.deleteAll = (req, res) => {
    deleteAllServices(res)
};

/**
 * @swagger
 * /aboutus:
 *   post:
 *     summary: Save about us body to a JSON file
 *     tags: [AboutUs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: About us body saved to file
 *       500:
 *         description: Failed to write file
 */
exports.saveAboutUsToFile = (req, res) => {
    const filePath = path.join(__dirname, "../../aboutus-body.json");
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: "Failed to write file", error: err });
        }
        res.send({ message: "About us body saved to file", file: filePath });
    });
};

/**
 * @swagger
 * /aboutus:
 *   get:
 *     summary: Read and return the content of the about us JSON file
 *     tags: [AboutUs]
 *     responses:
 *       200:
 *         description: About us file content returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Failed to read file or invalid JSON
 */
exports.readAboutUsFromFile = (req, res) => {
    const filePath = path.join(__dirname, "../../aboutus-body.json");
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Failed to read file", error: err });
        }
        try {
            const json = JSON.parse(data);
            res.send(json);
        } catch (parseErr) {
            res.status(500).send({ message: "File content is not valid JSON", error: parseErr });
        }
    });
};

/**
 * @swagger
 * /ai/service-demand-forecast:
 *   post:
 *     summary: Demand Forecasting for dental services
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               historicalData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Predicted service demand
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 forecast:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.serviceDemandForecast = async (req, res) => {
  try {
    const { historicalData } = req.body;
    // AI logic (demo)
    const forecast = ["Cosmetic Dentistry", "Restorative Dentistry"];
    res.send({ forecast });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/service-pricing-insights:
 *   post:
 *     summary: AI Pricing Insights for services
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               localMarketData:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Competitive pricing suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pricingSuggestions:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.servicePricingInsights = async (req, res) => {
  try {
    const { localMarketData } = req.body;
    // AI logic (demo)
    const pricingSuggestions = [
      "Set whitening at $120 for competitive edge.",
      "Bundle check-up + cleaning for $99."
    ];
    res.send({ pricingSuggestions });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/service-recommendation:
 *   post:
 *     summary: Service Recommendation System
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientHistory:
 *                 type: object
 *     responses:
 *       200:
 *         description: Add-on service recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 */
exports.serviceRecommendation = async (req, res) => {
  try {
    const { patientHistory } = req.body;
    // AI logic (demo)
    const recommendations = ["Add cleaning to your check-up", "Consider whitening after braces"];
    res.send({ recommendations });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};