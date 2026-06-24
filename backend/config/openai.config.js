const fs = require("fs");
const path = require("path");

const clinicPath = path.join(__dirname, "../clinic.json");

function getOpenAIKey() {
  try {
    const data = fs.readFileSync(clinicPath, "utf8");
    const json = JSON.parse(data);
    return json.ia.OPEN_API_KEY || "";
  } catch (err) {
    return "";
  }
}

module.exports = {
  OPENAI_API_KEY: getOpenAIKey(),
};