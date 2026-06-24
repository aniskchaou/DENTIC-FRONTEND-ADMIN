const cron = require('node-cron');
const { matchPatientsToScheduledCampaigns } = require('./marketingPatientMatcher');

// Load schedule from clinic.json
const fs = require('fs');
const path = require('path');
const clinicConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../clinic.json'), 'utf8'));
const marketingJob = clinicConfig.cronJobs?.find(j => j.name === 'marketingPatientMatcher' && j.enabled);
const schedule = marketingJob ? marketingJob.schedule : '* * * * *';

cron.schedule(schedule, async () => {
  console.log('Running marketing-patient matching job...');
  try {
    const results = await matchPatientsToScheduledCampaigns();
    results.forEach(({ campaign, matchedPatients }) => {
      console.log(`Campaign: ${campaign.campaignName}`);
      console.log('Matched Patients:', matchedPatients.map(p => p.id));
    });
  } catch (err) {
    console.error('Error running marketing-patient matching job:', err);
  }
});

// To keep the process alive if running standalone
console.log('Scheduler started.');
