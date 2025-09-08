# Remote Installation (Render Or Heroku)

This guide explains how to deploy the Dentic application (frontend and backend) with a PostgreSQL database on cloud platforms like Render and Heroku.

---

## Prerequisites

- Source code for Dentic frontend and backend
- GitHub account (for easy deployment)
- Render or Heroku account

---

## Step 1 : Create a PostgreSQL Database in Heroku and Render

---

### Heroku

1. Log in to [Heroku Dashboard](https://dashboard.heroku.com/).
2. Create a new app or select an existing app.
3. Go to the **Resources** tab.
4. Search for **Heroku Postgres** in the "Add-ons" section.
5. Click **Heroku Postgres** and choose a plan (Hobby Dev is free for testing).
6. Click **Provision**.
7. Go to the **Settings** tab > **Reveal Config Vars**.


---

### Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** > **PostgreSQL**.
3. Fill in the database name (e.g., `dentic`), region, and choose a plan.
4. Click **Create Database**.
5. After creation, go to the database details page.




 Add Database Credentials in backend/db/init.sequelize.js : 

````
if (DEMO_MODE) {
  // Demo mode: use SQLite (file-based for persistence, ':memory:' for in-memory)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  console.log("Running in DEMO MODE with in-memory SQLite (cache).");
} else {
  // Production mode: use PostgreSQL
  sequelize = new Sequelize(
    DATABASE,USERNAME,PASSWORD
    {
      host: URL_DB,
      port:  5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.PGSSLMODE === 'require'
          ? {
              require: true,
              rejectUnauthorized: false 
            }
          : false
      },
      logging: true,
    }
  );
  console.log("Running in PRODUCTION MODE with PostgreSQL database.");
}
````


## Step 2 : Create Backend and Frontend Repositories on GitHub & Push Code

### 1. Create Repositories

- Go to [GitHub](https://github.com/) and log in.
- Click the "+" icon (top right) > **New repository**.
- Create two repositories:
  - `dentic-backend`
  - `dentic-frontend`

---

### 2. Initialize Local Projects (if not already initialized)

**In your project folders:**

```sh
cd path/to/dentic-backend
git init

cd path/to/dentic-frontend
git init
```

---

### 3. Add Remote and Push Code

**Backend:**

```sh
cd path/to/dentic-backend
git remote add origin https://github.com/your-username/dentic-backend.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

**Frontend:**

```sh
cd path/to/dentic-frontend
git remote add origin https://github.com/your-username/dentic-frontend.git
git add .
git commit -m "Initial commit"
git push -u origin master
```

---

Now your backend and frontend code are pushed to separate GitHub repositories.

---

## Step 3: Deploy Backend and Frontend from GitHub to Render

---

### 1. Prepare Your Repositories

- Push your backend and frontend code to separate GitHub repositories.

---

### 2. Deploy Backend to Render

1. Log in to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** > **Web Service**.
3. Connect your backend GitHub repository.
4. Fill in service name and select branch.
5. Set the build command:
   ```
   npm install
   ```
6. Set the start command:
   ```
   npm run start
   ```
7. Click **Create Web Service** to deploy.


### 3. Deploy Frontend to Render
0. Add  backend URL /src/main/urls/urls.js in frontend project
   ```js
   export const BASE_URL = "https://your-backend-service.onrender.com/api"; // Replace with your backend URL
   ```
1. Click **New** > **Web Service**.
2. Connect your frontend GitHub repository.
3. Fill in service name and select branch.
4. Set the build command:
   ```
   npm install && npm run build
   ```
5. Set the start command:
   ```
   npm run start
   ```
6. Click **Create Web Service** to deploy.


## Step 3 Alternative : Deploy Backend and Frontend from GitHub to Heroku

### 1. Deploy Backend to Heroku

1. Log in to [Heroku Dashboard](https://dashboard.heroku.com/).
2. Click **New** > **Create new app**.
3. Enter an app name and select a region.
4. Go to the **Deploy** tab.
5. Under **Deployment method**, select **GitHub**.
6. Connect your GitHub account and search for your backend repository.
7. Click **Connect**.
8. Choose a branch (usually `master` or `main`).
9. Click **Enable Automatic Deploys** (optional) or **Deploy Branch**.
10. Heroku will automatically detect Node.js and install dependencies.
11. After deployment, your backend will be live at `https://your-app-name.herokuapp.com`.

---

### 2. Deploy Frontend to Heroku
0. Add  backend URL /src/main/urls/urls.js in frontend project
   ```js
   export const BASE_URL = "https://your-backend-service.onrender.com/api"; // Replace with your backend URL
   ```
1. Click **New** > **Create new app**.
2. Enter an app name and select a region.
3. Go to the **Deploy** tab.
4. Under **Deployment method**, select **GitHub**.
5. Connect your GitHub account and search for your frontend repository.
6. Click **Connect**.
7. Choose a branch (usually `master` or `main`).
8. Click **Enable Automatic Deploys** (optional) or **Deploy Branch**.
9. Heroku will install dependencies and build your React app.
10. After deployment, your frontend will be live at `https://your-app-name.herokuapp.com`.

---
## Step 4: Accessing the Application in Render or Heroku

---

### Render

- After deploying both backend and frontend services, Render will provide public URLs for each.
- **Frontend:**  
  Open your browser and go to the Render frontend URL (e.g., `https://your-frontend-service.onrender.com`).
- **Backend:**  
  The backend API will be available at its Render URL (e.g., `https://your-backend-service.onrender.com`).
- Make sure your frontend is configured to use the backend URL (see `/src/main/urls/urls.js`).

---

### Heroku

- After deployment, Heroku will provide public URLs for both apps.
- **Frontend:**  
  Open your browser and go to the Heroku frontend URL (e.g., `https://your-frontend-app.herokuapp.com`).
- **Backend:**  
  The backend API will be available at its Heroku URL (e.g., `https://your-backend-app.herokuapp.com`).
- Make sure your frontend is configured to use the backend URL (see `/src/main/urls/urls.js`).


