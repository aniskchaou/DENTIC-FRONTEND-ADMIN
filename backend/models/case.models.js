
    var sequelize = require("../db/init.sequelize.js");
    var { Sequelize, DataTypes } = require('sequelize');

const CaseStudy = sequelize.define("caseStudy", {

  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the patient involved in the case study",
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: "Reference to the doctor who conducted the case study",
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Title of the case study",
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Description of the case study, including key details and background",
  },
  proceduresPerformed: {
    type: DataTypes.JSONB,
    allowNull: false,
    comment: "List of procedures performed during the case study",
  },
  outcome: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "Outcome of the case study (e.g., successful treatment, complications)",
  },
  researchFiles: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: "List of URLs linking to research files (documents, images, videos) associated with the case study",
  },
  status: {
    type: DataTypes.ENUM("Ongoing", "Completed", "Published"),
    allowNull: false,
    comment: "Status of the case study (e.g., ongoing, completed, or published)",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the case study was created",
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    comment: "Timestamp when the case study was last updated",
  },
});

/* // Define relationships with other models
CaseStudy.associate = models => {
  // A case study is associated with a patient and a doctor
  CaseStudy.belongsTo(models.Patient, { foreignKey: "patientId" });
  CaseStudy.belongsTo(models.Doctor, { foreignKey: "doctorId" });
}; */

/**
 * Add a new case study to the database.
 * @param {Object} data - The case study data.
 * @returns {Promise<Object>} The created case study instance.
 */
CaseStudy.addCaseStudy = async function(data) {
  try {
    const caseStudy = await this.create(data);
    return caseStudy;
  } catch (error) {
    throw error;
  }
};

/**
 * Add dummy case studies to the database for testing/demo purposes.
 * @returns {Promise<Array<Object>>} The created case study instances.
 */
CaseStudy.addDummyData = async function() {
  const dummyData = [
    {
      patientId: "11111111-1111-1111-1111-111111111111",
      doctorId: "22222222-2222-2222-2222-222222222222",
      title: "Wisdom Tooth Extraction",
      description: "Extraction of impacted lower wisdom tooth with minimal complications.",
      proceduresPerformed: ["X-Ray", "Local Anesthesia", "Extraction", "Suturing"],
      outcome: "Successful extraction, patient recovered well.",
      researchFiles: ["https://example.com/wisdomtooth.pdf"],
      status: "Completed"
    },
    {
      patientId: "33333333-3333-3333-3333-333333333333",
      doctorId: "44444444-4444-4444-4444-444444444444",
      title: "Orthodontic Braces Case",
      description: "Correction of severe dental crowding using fixed orthodontic appliances.",
      proceduresPerformed: ["Braces Placement", "Monthly Adjustments", "Retainer Placement"],
      outcome: "Treatment ongoing, significant improvement observed.",
      researchFiles: [],
      status: "Ongoing"
    },
    {
      patientId: "55555555-5555-5555-5555-555555555555",
      doctorId: "66666666-6666-6666-6666-666666666666",
      title: "Dental Implant Placement",
      description: "Single tooth implant placement in the upper jaw.",
      proceduresPerformed: ["CBCT Scan", "Implant Placement", "Crown Placement"],
      outcome: "Implant integrated successfully, patient satisfied.",
      researchFiles: ["https://example.com/implant-case.jpg"],
      status: "Published"
    }
  ];
  try {
    const caseStudies = await this.bulkCreate(dummyData);
    return caseStudies;
  } catch (error) {
    throw error;
  }
};

module.exports = CaseStudy;

