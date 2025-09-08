# Local Installation

This guide explains how to install and run the Dentic application (frontend and backend) on your local machine after downloading the source code. The instructions below use PostgreSQL as the database.

---

## Prerequisites

- **Operating System:** Windows 10/11, macOS 12+, or Linux (Ubuntu 20.04+, CentOS 8+, Debian 11+)
- **Node.js:** v16.x or v18.x (LTS recommended)
- **npm:** v7.x or v8.x
- **PostgreSQL:** v13.x or v14.x
- **Git:** For cloning the repository

---

## 1. Install PostgreSQL

### Windows

- Download the installer from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Run the installer and follow the setup instructions.
- Set a password for the `postgres` user and remember it.
- After installation, open **pgAdmin** or use the command line to create a database:

```sh
psql -U postgres
CREATE DATABASE dentic;
```

### macOS

- Install using Homebrew:

```sh
brew install postgresql
brew services start postgresql
```

- Create the database:

```sh
psql postgres
CREATE DATABASE dentic;
```

### Linux (Ubuntu/Debian)

```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres psql
CREATE DATABASE dentic;
```

---

## 2. Install Frontend

Navigate to the frontend project folder:

```sh
cd FRONTEND
npm install
```

### Start Frontend

```sh
npm run serve
```

The frontend will be available at [http://localhost:3000](http://localhost:3000).

---

## 3. Install Backend

Navigate to the backend project folder:

```sh
cd ../BACKEND
npm install
```

### Start Backend

```sh
npm run start
```

The backend server will run on [http://localhost:5000](http://localhost:5000).

---

## 4. Access the Application

- Open your browser and go to [http://localhost:3000](http://localhost:3000).
- Log in with the default admin credentials (admin/admin) or create a new user.

---

## 5. Troubleshooting

- Ensure all dependencies are installed and the correct Node.js version is used.
- Review terminal output for errors and resolve missing packages or connection issues.
- Make sure PostgreSQL service is running and accessible.

---

## Notes

- Refer to the Server Requirements section for recommended hardware and software versions.

---