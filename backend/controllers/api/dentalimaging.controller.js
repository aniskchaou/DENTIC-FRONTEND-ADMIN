/**
 * @swagger
 * /dental-imaging/dicom-files/{mrn}:
 *   get:
 *     summary: Get accessible URLs of DICOM files for a patient by MRN
 *     tags: [DentalImaging]
 *     parameters:
 *       - in: path
 *         name: mrn
 *         required: true
 *         schema:
 *           type: string
 *         description: Medical Record Number of the patient
 *     responses:
 *       200:
 *         description: List of accessible DICOM file URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: No DICOM files found for MRN
 */
exports.getDicomFilesByMRN = (req, res) => {
  const mrn = req.params.mrn;
  const dicomDir = path.join(__dirname, '../../uploads/dicom', mrn);
  if (!fs.existsSync(dicomDir)) {
    return res.status(404).send({ message: 'No DICOM files found for this MRN.' });
  }
  const files = fs.readdirSync(dicomDir).filter(f => f.endsWith('.dcm'));
  // Build full URLs using request protocol and host
  const baseUrl = req.protocol + '://' + req.get('host');
  const urls = files.map(filename => baseUrl + `/uploads/dicom/${mrn}/${filename}`);
  res.send({ files: urls });
};
const {
    findAllDentalImaging,
    findDentalImagingById,
    createDentalImaging,
    updateDentalImaging,
    deleteDentalImagingById,
    deleteAllDentalImaging
} = require("../../services/dentalimaging.services");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");
const { OPENAI_API_KEY } = require("../../config/openai.config");
const vision = require('@google-cloud/vision');
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Google Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient();

// Initialize Vertex AI for MedLM
const vertexAI = new VertexAI({ project: 'sincere-woods-127712', location: 'us-central1' });
const model = vertexAI.getGenerativeModel({ model: 'medlm' }); // Use correct MedLM model name


/**
 * @swagger
 * tags:
 *   name: DentalImaging
 *   description: API for managing dental imaging records
 */


/**
 * @swagger
 * /dental-imaging:
 *   post:
 *     summary: Create a new dental imaging record
 *     tags: [DentalImaging]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               imageType:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               diagnosisNotes:
 *                 type: string
 *               uploadDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Dental imaging record created
 *       400:
 *         description: Content can not be empty!
 */
exports.create = (req, res) => {
    // req.file contains the uploaded file info
    // req.body contains the other form fields
    const fileUrl = req.file ? req.file.path : null;
    const imagingData = {
        ...req.body,
        imageUrl: fileUrl // Save the file path or URL in your DB
    };
    createDentalImaging(imagingData, res);
};

/**
 * @swagger
 * /dental-imaging:
 *   get:
 *     summary: Get all dental imaging records
 *     tags: [DentalImaging]
 *     responses:
 *       200:
 *         description: List of all dental imaging records
 */
exports.findAll = (req, res) => {
    findAllDentalImaging(null, res);
};

/**
 * @swagger
 * /dental-imaging/{id}:
 *   get:
 *     summary: Get a dental imaging record by ID
 *     tags: [DentalImaging]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dental imaging record data
 *       404:
 *         description: Dental imaging record not found
 */
exports.findOne = (req, res) => {
    const id = req.params.id;
    findDentalImagingById(id, res);
};

/**
 * @swagger
 * /dental-imaging/{id}:
 *   put:
 *     summary: Update a dental imaging record by ID
 *     tags: [DentalImaging]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Dental imaging record updated
 *       404:
 *         description: Dental imaging record not found
 */
exports.update = (req, res) => {
    const id = req.params.id;
    updateDentalImaging(id, req, res);
};

/**
 * @swagger
 * /dental-imaging/{id}:
 *   delete:
 *     summary: Delete a dental imaging record by ID
 *     tags: [DentalImaging]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dental imaging record deleted
 *       404:
 *         description: Dental imaging record not found
 */
exports.delete = (req, res) => {
    const id = req.params.id;
    deleteDentalImagingById(id, res);
};

/**
 * @swagger
 * /dental-imaging:
 *   delete:
 *     summary: Delete all dental imaging records
 *     tags: [DentalImaging]
 *     responses:
 *       200:
 *         description: All dental imaging records deleted
 */
exports.deleteAll = (req, res) => {
    deleteAllDentalImaging(res);
};

/**
 * @swagger
 * /dental-imaging/image/{filename}:
 *   get:
 *     summary: Get a dental imaging file by filename
 *     tags: [DentalImaging]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image file returned
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
exports.getImage = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../../uploads", filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send({ message: "Image not found" });
        }
        res.setHeader("Content-Type", "application/dicom");
        res.sendFile(filePath);
    });
};

/**
 * @swagger
 * /ai/xray-analysis:
 *   post:
 *     summary: AI X-ray Analysis
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: X-ray findings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 findings:
 *                   type: array
 *                   items:
 *                     type: string
 */
/**
 * @swagger
 * /ai/lab-test-report-analysis:
 *   post:
 *     summary: AI Lab Test Report Analysis
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Lab test findings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 findings:
 *                   type: array
 *                   items:
 *                     type: object
 *                 raw:
 *                   type: string
 */
exports.labTestReportAnalysis = async (req, res) => {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) {
      return res.status(400).send({ message: "No image uploaded" });
    }

    let mimeType = "image/png";
    if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpg") {
      mimeType = "image/jpeg";
    }

    const imageBase64 = imageBuffer.toString("base64");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    // Prompt for lab test report analysis
    const prompt = `Analyze this lab test report image and extract the following information for each test:
      - test_name: (e.g. CBC, Glucose, Cholesterol)
      - result_value: (numeric or qualitative result)
      - unit: (e.g. mg/dL, mmol/L)
      - reference_range: (normal range for the test)
      - interpretation: (e.g. normal, high, low, abnormal)
      - clinical_significance: (brief explanation)
      - recommendation: (suggested follow-up or action)
      If not possible, return a general summary of the report.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 400,
      temperature: 0.1,
    });

    let findings = [];
    const raw = completion.choices[0].message.content;
    console.log("RAW AI OUTPUT (lab test):", raw);
    try {
      findings = JSON.parse(raw);
      if (!Array.isArray(findings)) throw new Error("Not an array");
    } catch (e) {
      const match = raw.match(/\[.*\]/s);
      if (match) {
        try {
          findings = JSON.parse(match[0]);
        } catch (err) {
          findings = [{ test_name: "Approximate response", summary: raw }];
        }
      } else {
        findings = [{ test_name: "Approximate response", summary: raw }];
      }
    }
    res.send({ findings, raw });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};
exports.xrayAnalysis = async (req, res) => {
  try {
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) {
      return res.status(400).send({ message: "No image uploaded" });
    }

    // Detect image type from req.file.mimetype
    let mimeType = "image/png";
    if (req.file.mimetype === "image/jpeg" || req.file.mimetype === "image/jpg") {
      mimeType = "image/jpeg";
    }

    const imageBase64 = imageBuffer.toString("base64");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    // Advanced prompt for detailed findings
    const prompt = `Analyze this dental X-ray and return detected issues. Each issue should be an object with:
      - issue: (e.g. cavity, gum disease, root infection, impacted tooth)
      - severity: (mild, moderate, severe)
      - location: (tooth number or area)
      - recommendation: (treatment or next steps)
      - tooth_surface: (e.g. occlusal, buccal, lingual, mesial, distal)
      - stage: (early, moderate, advanced)
      - confidence: (percentage or qualitative confidence)
      - notes: (additional clinical notes)
      - urgency: (routine, urgent, emergency)
      - follow_up: (suggested follow-up interval or action)
      - patient_risk_factors: (e.g. diabetes, smoking, poor oral hygiene)
      - imaging_quality: (good, fair, poor)
      - image_artifacts: (yes/no, description if present)
      If not possible, return a general response.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1", // Use ChatGPT model 4.1
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 400,
      temperature: 0.1,
    });

    let findings = [];
    const raw = completion.choices[0].message.content;
    console.log("RAW AI OUTPUT:", raw);
    try {
      findings = JSON.parse(raw);
      // Validate structure
      if (!Array.isArray(findings)) throw new Error("Not an array");
    } catch (e) {
      // Fallback: try to extract JSON from text
      const match = raw.match(/\[.*\]/s);
      if (match) {
        try {
          findings = JSON.parse(match[0]);
        } catch (err) {
          findings = [{ issue: "Approximate response", summary: raw }];
        }
      } else {
        findings = [{ issue: "Approximate response", summary: raw }];
      }
    }
    res.send({ findings, raw });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/smile-simulation:
 *   post:
 *     summary: Smile Simulation (Cosmetic Dentistry)
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               simulationType:
 *                 type: string
 *                 enum: [whitening, braces, veneers]
 *     responses:
 *       200:
 *         description: Before/after simulation images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 beforeUrl:
 *                   type: string
 *                 afterUrl:
 *                   type: string
 */
exports.smileSimulation = async (req, res) => {
  try {
    // For demo: return placeholder URLs
    const beforeUrl = "https://example.com/before.jpg";
    const afterUrl = "https://example.com/after.jpg";
    res.send({ beforeUrl, afterUrl });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /ai/treatment-progress:
 *   post:
 *     summary: Treatment Progress Tracking
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               previousXray:
 *                 type: string
 *                 format: binary
 *               currentXray:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Progress comparison
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: string
 *                 details:
 *                   type: string
 */
exports.treatmentProgress = async (req, res) => {
  try {
    const beforeBuffer = req.files?.previousXray?.[0]?.buffer;
    const afterBuffer = req.files?.currentXray?.[0]?.buffer;
    if (!beforeBuffer || !afterBuffer) {
      return res.status(400).send({ message: "Both previousXray and currentXray images are required" });
    }

    // Detect image types
    let beforeMime = req.files.previousXray[0].mimetype === "image/jpeg" ? "image/jpeg" : "image/png";
    let afterMime = req.files.currentXray[0].mimetype === "image/jpeg" ? "image/jpeg" : "image/png";

    const beforeBase64 = beforeBuffer.toString("base64");
    const afterBase64 = afterBuffer.toString("base64");
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    // Prompt for progress analysis
    const prompt = `Compare the previous and current dental X-rays. Analyze and summarize any improvement, healing, or progression of dental issues. Respond with a JSON object containing:
      - progress: (e.g. improvement, no change, worsening)
      - details: (summary of findings)
      - recommendations: (next steps)
      - notes: (additional clinical notes)
      If not possible, return a general response.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: `data:${beforeMime};base64,${beforeBase64}` } },
            { type: "image_url", image_url: { url: `data:${afterMime};base64,${afterBase64}` } }
          ]
        }
      ],
      max_tokens: 400,
      temperature: 0.1,
    });

    let result = {};
    const raw = completion.choices[0].message.content;
    console.log("RAW AI OUTPUT (progress):", raw);
    try {
      result = JSON.parse(raw);
      if (typeof result !== "object") throw new Error("Not an object");
    } catch (e) {
      // Fallback: try to extract JSON from text
      const match = raw.match(/\{.*\}/s);
      if (match) {
        try {
          result = JSON.parse(match[0]);
        } catch (err) {
          result = { progress: "Approximate response", details: raw };
        }
      } else {
        result = { progress: "Approximate response", details: raw };
      }
    }
    res.send({ ...result, raw });
  } catch (err) {
    res.status(500).send({ message: "AI error", error: err.toString() });
  }
};

/**
 * @swagger
 * /dental-imaging/upload-dicom:
 *   post:
 *     summary: Upload DICOM file for a patient by MRN
 *     tags: [DentalImaging]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               MRN:
 *                 type: string
 *                 description: Medical Record Number of the patient
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: DICOM file uploaded successfully
 *       400:
 *         description: Missing MRN or file
 */
exports.uploadDicom = async (req, res) => {
  try {
    const MRN = req.body.MRN;
    const file = req.file;
    if (!MRN || !file) {
      return res.status(400).send({ message: 'Missing MRN or file.' });
    }
    const uploadDir = path.join(__dirname, '../../uploads/dicom', MRN);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const filePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(filePath, file.buffer);
    res.send({ message: 'DICOM file uploaded successfully.', filePath });
  } catch (err) {
    res.status(500).send({ message: 'Error uploading DICOM file', error: err.toString() });
  }
};