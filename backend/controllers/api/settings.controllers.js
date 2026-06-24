const Settings = require("../../models/service.models");

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Load settings from the database
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Error loading settings
 */

exports.loadSettings = async (req, res) => {
  try {
    const settings = await addSettingsData.findOne();
    if (!settings) {
      return res.status(404).send({ message: "Settings not found" });
    }
    res.send(settings);
  } catch (err) {
    res.status(500).send({ message: "Error loading settings" });
  }
};

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Save or update settings in the database
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings saved successfully
 *       500:
 *         description: Error saving settings
 */
exports.saveSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (settings) {
      await settings.update(req.body);
    } else {
      settings = await Settings.create(req.body);
    }
    res.send(settings);
  } catch (err) {
    res.status(500).send({ message: "Error saving settings" });
  }
};



const fs = require('fs');
const path = require('path');
const { addSettingsData } = require("../../models/settings.models");

/**
 * @swagger
 * /clinicsettings:
 *   put:
 *     summary: Save or update clinic settings in the database
 *     tags: [Settings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Settings saved successfully
 *       500:
 *         description: Error saving settings
 */
exports.saveClinicSettings = (req, res) => {
    const filePath = path.join(__dirname, "../../clinic.json");
    fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
        if (err) {
            return res.status(500).send({ message: "Failed to write file", error: err });
        }
        res.send({ message: "Clinic settings saved to file", file: filePath });
    });
};

/**
 * @swagger
 * /clinicsettings:
 *   get:
 *     summary: Load settings from the database
 *     tags: [Settings]
 *     responses:
 *       200:
 *         description: Settings loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Settings not found
 *       500:
 *         description: Error loading settings
 */
exports.readClinicSettings = (req, res) => {
    const filePath = path.join(__dirname, "../../clinic.json");
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