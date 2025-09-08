# Server Requirements

To run Dentic smoothly, both the frontend and backend require a modern server environment with the following specifications and software versions:

## Hardware

- **Processor:** Dual-core CPU or higher (Quad-core recommended for multi-user clinics)
- **Memory:** Minimum 4 GB RAM (8 GB or more recommended)
- **Storage:** SSD with at least 20 GB free space
- **Network:** Stable internet connection for remote installations and integrations

## Operating System

- Windows 10/11, macOS 12+, or any modern Linux distribution (Ubuntu 20.04+, CentOS 8+, Debian 11+)

## Frontend Requirements

- **Node.js:** v16.x or v18.x (LTS recommended)
- **npm:** v7.x or v8.x
- **React:** v17.x
- **React Scripts:** v5.x
- **Browsers:** Latest versions of Chrome, Firefox, Safari, or Edge
- **Other:** Ensure all dependencies listed in `package.json` are installed

## Backend Requirements

- **Node.js:** v16.x or v18.x (LTS recommended)
- **npm:** v7.x or v8.x
- **Express:** v4.x
- **Database:**  
  - **MongoDB:** v5.x or v6.x (if using Mongoose)  
  - **PostgreSQL:** v13.x or v14.x  
  - **MySQL:** v8.x  
  - **SQLite3:** v5.x (for local/testing)
- **Other:**  
  - **Mongoose:** v5.x  
  - **Sequelize:** v6.x  
  - **Swagger:** v6.x  
  - **OpenAI, Google Cloud SDKs:** Latest stable versions

## Additional Recommendations

- **SSL/TLS:** For secure remote deployments, enable HTTPS.
-