# Third-Party Integrations

Dentic supports a wide range of third-party integrations to enhance clinic operations, improve patient experience, and automate workflows. These integrations allow clinics to connect with external services for scheduling, communication, payments, analytics, and AI-powered features.

## Supported Integrations

- **Google Calendar**: Synchronize clinic appointments with Google Calendar, enabling staff and patients to receive automatic reminders and manage schedules seamlessly.
- **Google Meet**: Integrate telemedicine appointments with Google Meet, allowing for secure video consultations and easy access to meeting links.
- **AI & Machine Learning Services**: Leverage OpenAI, Google Vertex AI, and other platforms for smart features such as health profile analysis, image recognition, and natural language processing.
- **File Storage & Export**: Export data to Excel, PDF, and other formats using libraries like XLSX, jsPDF, and html2canvas.

---

## How to Generate Google Calendar OAuth Client ID

To enable Google Calendar integration, you need to create an OAuth client ID in the Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing project.
3. In the left sidebar, go to **APIs & Services** > **Credentials**.
4. Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
5. If prompted, configure the consent screen (fill in required fields).
6. Choose **Web application** as the application type.
7. Enter a name for your client (e.g., "Dentic Calendar Integration").
8. Under **Authorized redirect URIs**, add the URI where Google should redirect after authentication (e.g., `https://your-frontend-app.com/oauth2callback`).
9. Click **Create**.
10. Copy the **Client ID** and **Client Secret** shown—add these to your application's configuration or environment variables.

---

## How to Generate an OpenAI API Key

To enable AI-powered features in Dentic, you need an API key from OpenAI:

1. Go to [OpenAI Platform](https://platform.openai.com/).
2. Log in or create an OpenAI account.
3. In the left sidebar, click **API Keys**.
4. Click **+ Create new secret key**.
5. Enter a name for your key (e.g., "Dentic Integration") and click **Create secret key**.
6. Copy the generated API key and save it securely.
7. Add this key to your application's configuration or environment variables (e.g., `OPENAI_API_KEY`).

---

**Note:**  
- Make sure to enable the **Google Calendar API** for your project in the Cloud Console.
- Use the generated Client ID and Secret in your backend or server configuration to authenticate requests to the Google Calendar API.
- Keep your API key private and never expose it in client-side code.
- You may need to set usage limits or billing preferences in your OpenAI account.
