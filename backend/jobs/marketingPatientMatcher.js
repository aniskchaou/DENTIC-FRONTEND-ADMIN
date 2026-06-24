const { Patient } = require('../models/patient.models');
const MarketingCRM = require('../models/marketing.models');
const { sendMail } = require('../utils/email.services');
const { Op } = require('sequelize');

/**
 * Job: For each scheduled marketing campaign, find matching patients by insuranceId, bloodType, or allergies.
 * Send email to matched patients at campaign.scheduleDate.
 */
async function matchPatientsToScheduledCampaigns() {
  // Get all scheduled campaigns
  const campaigns = await MarketingCRM.findAll({ where: { status: 'Scheduled' } });
  const results = [];
  for (const campaign of campaigns) {
    // Build OR criteria for patient search
    const orConditions = [];
    if (campaign.insuranceId) {
      orConditions.push({ insuranceId: campaign.insuranceId });
    }
    if (campaign.bloodType) {
      orConditions.push({ bloodType: campaign.bloodType });
    }
    if (campaign.allergies) {
      const campaignAllergies = Array.isArray(campaign.allergies)
        ? campaign.allergies
        : campaign.allergies.split(',').map(a => a.trim()).filter(a => a);
      if (campaignAllergies.length > 0) {
        orConditions.push({ allergies: { [Op.overlap]: campaignAllergies } });
      }
    }
    // Find matching patients (OR logic)
    const matchedPatients = await Patient.findAll({
      where: {
        [Op.or]: orConditions
      }
    });
    results.push({ campaign, matchedPatients });

    // Collect emails
    const emails = matchedPatients.map(p => p.email).filter(e => !!e);
    if (emails.length > 0) {
      // Schedule email sending at campaign.scheduleDate
      const delay = Math.max(0, new Date(campaign.scheduleDate) - new Date());
      setTimeout(() => {
        sendMail({
          to: emails,
          subject: campaign.campaignName,
          text: campaign.messageTemplate
        })
        .then(async () => {
          console.log(`Sent campaign '${campaign.campaignName}' to:`, emails);
          // Update campaign status to Completed
          campaign.status = 'Completed';
          await campaign.save();
        })
        .catch(err => console.error('Error sending campaign email:', err));
      }, delay);
    }
  }
  return results;
}

module.exports = { matchPatientsToScheduledCampaigns };
