// DEMO INTERCEPTOR FOR AXIOS
import axios from "axios";
import CurrentUser from "../config/user";

// Enable or disable demo mode
export const demo = CurrentUser.DEMO_MODE; // Set to false to disable the interceptor

// Map endpoints to local JSON files (put your JSON files in /public/demo/)
const endpointToFile = {
  "/aboutus": "/demo/aboutus.json",
  "/appointments": "/demo/appointments.json",
  "/certificates": "/demo/certificates.json",
  "/clinics": "/demo/clinics.json",
  "/clinicssettings": "/demo/clinicssettings.json",
  "/dental-imaging": "/demo/dental-imaging.json",
  "/diagnoses": "/demo/diagnoses.json",
  "/doctors": "/demo/doctors.json",
  "/equipements": "/demo/equipement.json",
  "/expenses": "/demo/expenses.json",
  "/insurances": "/demo/insurances.json",
  "/inventory": "/demo/inventory.json",
  "/invoices": "/demo/invoices.json",
  "/labtests": "/demo/labtests.json",
  "/medicament-manufactures": "/demo/medicament-manufactures.json",
  "/medicaments-categories": "/demo/medicaments-categories.json",
  "/medicaments": "/demo/medicaments.json",
  "/memberships": "/demo/memberships.json",
  "/operations": "/demo/operations.json",
  "/patients": "/demo/patients.json",
  "/prescriptions": "/demo/prescriptions.json",
  "/procedures": "/demo/procedures.json",
  "/services": "/demo/services.json",
  "/staff": "/demo/staff.json",
  "/telemedicines": "/demo/telemedicines.json",
  "/treatmentplans": "/demo/treatmentplans.json",
  // Add more mappings as needed
};

if (demo) {
  axios.defaults.baseURL = ""; // or "/"
  axios.interceptors.request.use(async (config) => {
    console.log(`Request Method: ${config.method}`);
    if (!config.method) config.method = "get"; // Ensure method is always set

    if (config.method.toLowerCase() === "get" && typeof config.url === "string") {
      // Extract path from full URL (handles both relative and absolute URLs)
      let urlPath;
      try {
        urlPath = new URL(config.url, window.location.origin).pathname.split('?')[0];
        console.log(`Request URL Path: ${urlPath}`);
      } catch {
        urlPath = config.url.split('?')[0];
      }

      // Match if the path is exactly the endpoint, or starts with endpoint + "/" or endpoint + "?"
      const endpoint = Object.keys(endpointToFile).find((ep) =>
        urlPath === ep || urlPath.startsWith(ep + "/") || urlPath.startsWith(ep + "?")
      );
      if (endpoint) {
        config.adapter = async () => {
          const response = await fetch(endpointToFile[endpoint]);
          if (!response.ok) {
            return {
              data: { error: "Demo data not found" },
              status: 404,
              statusText: "Not Found",
              headers: {},
              config,
              request: {},
            };
          }
          const data = await response.json();
          return {
            data,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
            request: {},
          };
        };
      }
    }
    return config;
  });
}