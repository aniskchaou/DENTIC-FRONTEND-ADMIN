
  var sequelize = require("../db/init.sequelize.js");
  var { Sequelize, DataTypes } = require('sequelize');
  var AIFeatures = sequelize.define("ai_features", {

    featureType: {
      type: Sequelize.ENUM("AI Chatbot", "Treatment Recommendation", "Predictive Analytics", "Voice-to-Text Notes"),
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    usageStatistics: {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {
        totalUses: 0,
        successRate: 0.0,
        averageResponseTime: 0.0,
      },
    },
    lastUpdated: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    enabled: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });
  
  module.exports = AIFeatures;

  var AITreatmentRecommendation = sequelize.define("ai_treatment_recommendation", {

    patientId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    doctorId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    symptoms: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    AIAnalysis: {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {
        probableConditions: [],
        recommendedTreatments: [],
      },
    },
    doctorApprovalStatus: {
      type: Sequelize.ENUM("Pending", "Approved", "Modified"),
      defaultValue: "Pending",
    },
    finalTreatmentPlan: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
  
  module.exports = AITreatmentRecommendation;

  var Referral = sequelize.define("referral", {
 
    patientId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    referredByDoctorId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    referredToSpecialistId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    reasonForReferral: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    specialistClinicId: {
      type: Sequelize.UUID,
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM("Pending", "Accepted", "Rejected", "Completed"),
      defaultValue: "Pending",
    },
    appointmentDate: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    feedbackFromSpecialist: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
  
  module.exports = Referral;

  var AIPredictiveAnalytics = sequelize.define("ai_predictive_analytics", {
 
    clinicId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    predictionType: {
      type: Sequelize.ENUM("Appointment Demand", "Common Procedures", "Revenue Forecast", "Patient Retention"),
      allowNull: false,
    },
    analysisPeriod: {
      type: Sequelize.ENUM("Last 30 Days", "Last 6 Months", "Last 1 Year"),
      allowNull: false,
    },
    predictedOutcome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    confidenceScore: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    recommendedActions: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    },
    generatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    status: {
      type: Sequelize.ENUM("Pending Review", "Implemented", "Rejected"),
      defaultValue: "Pending Review",
    },
    reviewedBy: {
      type: Sequelize.UUID,
      allowNull: true
      // references: {
      //   model: "users",
      //   key: "id",
      // },
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  });
  
  module.exports = AIPredictiveAnalytics;
  
  