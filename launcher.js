#!/usr/bin/env node
/**
 * launcher.js
 * -----------
 * Zero-dependency, cross-platform interactive GUI Launcher for Dentic.
 * Boots a lightweight local server on http://localhost:3030 with a beautiful,
 * responsive web control panel to manage dependencies, database configuration,
 * and start/stop server controls.
 *
 * Runs on Windows, macOS, and Linux out of the box with zero external npm dependencies!
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, spawn, execSync } = require('child_process');

const PORT = 3030;
const ROOT_DIR = __dirname;
const BACKEND_DIR = path.join(ROOT_DIR, 'backend');

// ─── STATE MANAGEMENT ─────────────────────────────────────────────────────────

let backendProcess = null;
let frontendProcess = null;
let activeLogs = [];
let isInstalling = false;
let installProgress = 0;

function addLog(source, text) {
  const timestamp = new Date().toLocaleTimeString();
  activeLogs.push({ timestamp, source, text: String(text).trim() });
  if (activeLogs.length > 500) activeLogs.shift();
}

// ─── PREREQUISITES CHECK ──────────────────────────────────────────────────────

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}

function autoInstallSoftware(software) {
  addLog('Installer', `Attempting to automatically install ${software}...`);
  return new Promise((resolve) => {
    let cmd = '';
    if (process.platform === 'win32') {
      if (software === 'node')     cmd = 'winget install OpenJS.NodeJS -h --accept-source-agreements --accept-package-agreements';
      else if (software === 'git') cmd = 'winget install Git.Git -h --accept-source-agreements --accept-package-agreements';
      else if (software === 'mysql')    cmd = 'winget install Oracle.MySQL -h --accept-source-agreements --accept-package-agreements';
      else if (software === 'postgres') cmd = 'winget install PostgreSQL.PostgreSQL -h --accept-source-agreements --accept-package-agreements';
    } else if (process.platform === 'darwin') {
      if (software === 'node')     cmd = 'brew install node';
      else if (software === 'git') cmd = 'brew install git';
      else if (software === 'mysql')    cmd = 'brew install mysql';
      else if (software === 'postgres') cmd = 'brew install postgresql';
    } else {
      if (software === 'node')     cmd = 'sudo apt-get update && sudo apt-get install -y nodejs npm';
      else if (software === 'git') cmd = 'sudo apt-get update && sudo apt-get install -y git';
      else if (software === 'mysql')    cmd = 'sudo apt-get update && sudo apt-get install -y mysql-server';
      else if (software === 'postgres') cmd = 'sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib';
    }

    if (!cmd) {
      addLog('Installer', `❌ Auto-install not supported on platform: ${process.platform}.`);
      return resolve(false);
    }

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        addLog('Installer', `❌ Installation failed: ${err.message}`);
        resolve(false);
      } else {
        addLog('Installer', `✓ ${software} installed successfully!`);
        resolve(true);
      }
    });
  });
}

function getPreReqStatus() {
  const nodeInstalled = checkCommand('node');
  const npmInstalled  = checkCommand('npm');
  const gitInstalled  = checkCommand('git');

  let nodeVersion = 'Not Installed';
  let npmVersion  = 'Not Installed';

  if (nodeInstalled) {
    try { nodeVersion = execSync('node --version').toString().trim(); } catch (_) {}
  }
  if (npmInstalled) {
    try { npmVersion = execSync('npm --version').toString().trim(); } catch (_) {}
  }

  return {
    node: { installed: nodeInstalled, version: nodeVersion },
    npm:  { installed: npmInstalled,  version: npmVersion },
    git:  { installed: gitInstalled },
    allPassed: nodeInstalled && npmInstalled
  };
}

// ─── .ENV READ / WRITE FOR BACKEND ───────────────────────────────────────────

function readEnvConfigs() {
  const envPath = path.join(BACKEND_DIR, '.env');
  const defaults = {
    DB_DIALECT: 'mysql',
    DB_HOST:     'localhost',
    DB_PORT:     '3306',
    DB_NAME:     'dentic',
    DB_USER:     'root',
    DB_PASSWORD: '',
    BACKEND_PORT: '5000',
    FRONTEND_PORT: '3000'
  };

  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const idx = trimmed.indexOf('=');
        if (idx > 0) {
          const key = trimmed.slice(0, idx).trim();
          const val = trimmed.slice(idx + 1).trim();
          defaults[key] = val;
        }
      });
    } catch (_) {}
  }
  return defaults;
}

function writeEnvConfigs(newConfigs) {
  const envPath = path.join(BACKEND_DIR, '.env');
  const merged  = { ...readEnvConfigs(), ...newConfigs };

  const dialect = merged.DB_DIALECT || 'mysql';
  const lines = [
    '# Generated by Dentic Launcher',
    `NODE_ENV=development`,
    `PORT=${merged.BACKEND_PORT || '5000'}`,
    '',
    '# Database',
    `DB_DIALECT=${dialect}`,
    `DB_HOST=${merged.DB_HOST || 'localhost'}`,
    `DB_PORT=${merged.DB_PORT || (dialect === 'mysql' ? '3306' : '5432')}`,
    `DB_NAME=${merged.DB_NAME || 'dentic'}`,
    `DB_USER=${merged.DB_USER || 'root'}`,
    `DB_PASSWORD=${merged.DB_PASSWORD || ''}`,
  ];

  try {
    fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
    return true;
  } catch (err) {
    addLog('Launcher', `Error saving .env: ${err.message}`);
    return false;
  }
}

// ─── DEPENDENCY CHECK ─────────────────────────────────────────────────────────

function checkDepsInstalled() {
  return fs.existsSync(path.join(ROOT_DIR, 'node_modules')) &&
         fs.existsSync(path.join(BACKEND_DIR, 'node_modules'));
}

// ─── DEPENDENCY INSTALLER ─────────────────────────────────────────────────────

function runDependencyInstaller() {
  if (isInstalling) return;
  isInstalling = true;
  installProgress = 5;
  addLog('Installer', 'Installing frontend (root) dependencies...');

  // Install root (React CRA) first, then backend
  const rootInstall = spawn('npm', ['install', '--force'], { shell: true, cwd: ROOT_DIR });

  rootInstall.stdout.on('data', d => {
    addLog('NPM (Frontend)', d.toString());
    if (installProgress < 45) installProgress += 2;
  });
  rootInstall.stderr.on('data', d => addLog('NPM Warning', d.toString()));

  rootInstall.on('close', code => {
    if (code !== 0) {
      isInstalling = false;
      installProgress = 0;
      addLog('Installer', `❌ Frontend install failed (exit ${code}).`);
      return;
    }

    addLog('Installer', '✓ Frontend packages installed. Now installing backend...');
    installProgress = 50;

    const backendInstall = spawn('npm', ['install'], { shell: true, cwd: BACKEND_DIR });

    backendInstall.stdout.on('data', d => {
      addLog('NPM (Backend)', d.toString());
      if (installProgress < 95) installProgress += 2;
    });
    backendInstall.stderr.on('data', d => addLog('NPM Warning', d.toString()));

    backendInstall.on('close', code2 => {
      isInstalling = false;
      if (code2 === 0) {
        installProgress = 100;
        addLog('Installer', '✓ All dependencies installed successfully!');
      } else {
        installProgress = 0;
        addLog('Installer', `❌ Backend install failed (exit ${code2}).`);
      }
    });
  });
}

// ─── START / STOP APPLICATION ─────────────────────────────────────────────────

function startApplication() {
  if (backendProcess || frontendProcess) {
    addLog('Launcher', 'Application is already running!');
    return;
  }

  addLog('Launcher', 'Starting Dentic Backend API on port 5000...');
  backendProcess = spawn('node', ['server.js'], {
    shell: true,
    cwd: BACKEND_DIR,
    env: { ...process.env, PORT: '5000', NODE_ENV: 'development' }
  });

  backendProcess.stdout.on('data', d => addLog('Backend', d.toString()));
  backendProcess.stderr.on('data', d => addLog('Backend Error', d.toString()));
  backendProcess.on('error', err => {
    addLog('Backend Error', `Failed to start backend: ${err.message}`);
    backendProcess = null;
  });
  backendProcess.on('close', code => {
    if (code !== 0) addLog('Backend', `⚠ Process exited with code ${code} — check logs above.`);
    else addLog('Backend', 'Process stopped.');
    backendProcess = null;
  });

  addLog('Launcher', 'Starting Dentic Frontend (React dev server) on port 3001...');
  frontendProcess = spawn('npm', ['run', 'serve'], {
    shell: true,
    cwd: ROOT_DIR,
    env: { ...process.env, BROWSER: 'none', NODE_ENV: 'development' }
  });

  frontendProcess.stdout.on('data', d => addLog('Frontend', d.toString()));
  frontendProcess.stderr.on('data', d => addLog('Frontend Warning', d.toString()));
  frontendProcess.on('error', err => {
    addLog('Frontend Error', `Failed to start frontend: ${err.message}`);
    frontendProcess = null;
  });
  frontendProcess.on('close', code => {
    if (code !== 0) addLog('Frontend', `⚠ Process exited with code ${code} — check logs above.`);
    else addLog('Frontend', 'Process stopped.');
    frontendProcess = null;
  });
}

function stopApplication() {
  addLog('Launcher', 'Shutting down Dentic services...');

  if (backendProcess) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${backendProcess.pid} /T /F`);
      } else {
        backendProcess.kill();
      }
      addLog('Launcher', '✓ Backend stopped.');
    } catch (_) {}
    backendProcess = null;
  }

  if (frontendProcess) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${frontendProcess.pid} /T /F`);
      } else {
        frontendProcess.kill();
      }
      addLog('Launcher', '✓ Frontend stopped.');
    } catch (_) {}
    frontendProcess = null;
  }

  addLog('Launcher', '⏹ All services stopped.');
}

// ─── HTTP ROUTER ──────────────────────────────────────────────────────────────

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      prerequisites: getPreReqStatus(),
      database: readEnvConfigs(),
      isInstalling,
      installProgress,
      depsInstalled: checkDepsInstalled(),
      running: { backend: !!backendProcess, frontend: !!frontendProcess }
    }));
  }

  if (url.pathname === '/api/save-db' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const success = writeEnvConfigs(payload);
        res.writeHead(success ? 200 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (url.pathname === '/api/install' && req.method === 'POST') {
    runDependencyInstaller();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true }));
  }

  if (url.pathname === '/api/auto-install' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { software } = JSON.parse(body);
        const success = await autoInstallSoftware(software);
        res.writeHead(success ? 200 : 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  if (url.pathname === '/api/start' && req.method === 'POST') {
    startApplication();
    setTimeout(() => {
      try {
        const appUrl = 'http://localhost:3001';
        if (process.platform === 'win32')      exec(`start ${appUrl}`);
        else if (process.platform === 'darwin') exec(`open ${appUrl}`);
        else                                    exec(`xdg-open ${appUrl}`);
      } catch (_) {}
    }, 5000); // CRA dev server needs ~5s to compile on first start
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true }));
  }

  if (url.pathname === '/api/stop' && req.method === 'POST') {
    stopApplication();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true }));
  }

  if (url.pathname === '/api/logs') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(activeLogs));
  }

  if (url.pathname === '/api/clear-logs' && req.method === 'POST') {
    activeLogs = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ success: true }));
  }

  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(getHtmlContent());
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// ─── STARTUP ──────────────────────────────────────────────────────────────────

server.listen(PORT, 'localhost', () => {
  console.log(`================================================================`);
  console.log(` 🦷  Dentic Control Panel is now active!`);
  console.log(`================================================================`);
  console.log(` 📡  URL: http://localhost:${PORT}`);
  console.log(`================================================================`);

  try {
    const launcherUrl = `http://localhost:${PORT}`;
    if (process.platform === 'win32')      exec(`start ${launcherUrl}`);
    else if (process.platform === 'darwin') exec(`open ${launcherUrl}`);
    else                                    exec(`xdg-open ${launcherUrl}`);
  } catch (_) {}
});

// ─── EMBEDDED WEB CONTROL PANEL ───────────────────────────────────────────────

function getHtmlContent() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dentic — Control Panel Launcher</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dim:        #050d14;
      --bg-card:       #0b1929;
      --text-main:     #f0f9ff;
      --text-muted:    #7fa8c9;
      --accent-teal:   #06b6d4;
      --accent-green:  #10b981;
      --accent-red:    #ef4444;
      --accent-indigo: #6366f1;
      --border-soft:   rgba(6, 182, 212, 0.12);
      --font-mono:     'IBM Plex Mono', Consolas, monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg-dim);
      background-image:
        radial-gradient(circle at 15% 10%, rgba(6, 182, 212, 0.10) 0%, transparent 55%),
        radial-gradient(circle at 85% 90%, rgba(99, 102, 241, 0.08) 0%, transparent 55%);
      color: var(--text-main);
      font-family: 'Manrope', system-ui, sans-serif;
      min-height: 100vh;
      padding: 40px 20px;
    }
    .launcher-shell { max-width: 920px; margin: 0 auto; }

    /* ── HEADER ── */
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-card);
      border: 1px solid var(--border-soft);
      border-radius: 16px;
      padding: 24px 28px;
      margin-bottom: 28px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.6);
    }
    .brand-group { display: flex; align-items: center; gap: 16px; }
    .brand-icon  { font-size: 42px; }
    .brand-title { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--accent-teal); }
    .brand-sub   { font-size: 12px; color: var(--text-muted); margin-top: 3px; }
    .status-badge {
      display: inline-flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.04);
      padding: 6px 16px; border-radius: 99px;
      font-size: 11px; font-weight: 800; text-transform: uppercase;
      border: 1px solid var(--border-soft);
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-dot.glowing-green { background: var(--accent-green); box-shadow: 0 0 10px var(--accent-green); }
    .status-dot.glowing-red   { background: var(--accent-red);   box-shadow: 0 0 10px var(--accent-red); }

    /* ── WIZARD CARD ── */
    .wizard-card {
      background: var(--bg-card);
      border: 1px solid var(--border-soft);
      border-radius: 20px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      margin-bottom: 28px;
    }

    /* ── STEP NAV ── */
    .step-navigation {
      display: flex; justify-content: space-between; gap: 8px;
      margin-bottom: 36px; border-bottom: 1.5px solid var(--border-soft); padding-bottom: 16px;
    }
    .navigation-bullet {
      background: none; border: none; color: var(--text-muted);
      cursor: pointer; display: flex; align-items: center; gap: 10px;
      font-weight: 700; font-size: 14px; transition: all 0.2s;
      padding: 8px 12px; border-radius: 8px;
    }
    .navigation-bullet:hover { color: #fff; background: rgba(255,255,255,0.02); }
    .navigation-bullet.active-bullet { color: var(--accent-teal); }
    .navigation-bullet.active-bullet .bullet-digit { background: var(--accent-teal); color: #000; }
    .bullet-digit {
      background: rgba(255,255,255,0.08); color: var(--text-muted);
      border-radius: 50%; width: 24px; height: 24px;
      display: flex; align-items: center; justify-content: center;
      font-size: 11px; font-weight: 800;
    }

    /* ── PANES ── */
    .wizard-pane { display: none; }
    .wizard-pane.active-pane { display: block; }
    .pane-title    { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
    .pane-subtitle { color: var(--text-muted); font-size: 14px; margin-bottom: 24px; line-height: 1.6; }

    /* Step 1 ─ Requirements */
    .requirement-box { display: grid; gap: 14px; margin-bottom: 24px; }
    .requirement-row {
      display: flex; justify-content: space-between; align-items: center;
      background: rgba(0,0,0,0.18); border: 1px solid var(--border-soft);
      padding: 16px 20px; border-radius: 12px;
    }
    .row-meta h5 { font-size: 15px; font-weight: 700; }
    .row-meta p  { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
    .requirement-check { font-size: 20px; }
    .badge-passed  { color: var(--accent-green); font-weight: bold; }
    .badge-missing { color: var(--accent-red);   font-weight: bold; }

    /* Step 2 ─ Database */
    .db-cards-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      gap: 20px; margin-bottom: 28px;
    }
    .db-card-option {
      background: rgba(0,0,0,0.18); border: 1px solid var(--border-soft);
      border-radius: 14px; padding: 28px; text-align: center;
      cursor: pointer; transition: all 0.2s;
    }
    .db-card-option:hover { border-color: rgba(6,182,212,0.3); background: rgba(6,182,212,0.04); }
    .db-card-option.selected-db { border-color: var(--accent-teal); background: rgba(6,182,212,0.08); }
    .db-card-option input[type="radio"] { display: none; }
    .db-card-icon { font-size: 34px; margin-bottom: 12px; display: block; }
    .db-card-option h4 { font-weight: 800; font-size: 16px; }
    .db-card-desc { font-size: 11px; color: var(--text-muted); margin-top: 6px; }
    .db-form-fields {
      background: rgba(0,0,0,0.12); border: 1px solid var(--border-soft);
      border-radius: 12px; padding: 24px; margin-top: 20px;
    }
    .form-group { margin-bottom: 16px; }
    .form-group label {
      display: block; font-size: 11px; font-weight: 700;
      text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
    }
    .form-control {
      width: 100%; background: rgba(0,0,0,0.35);
      border: 1px solid var(--border-soft);
      padding: 11px 14px; border-radius: 8px; color: #fff; font-family: inherit;
    }
    .form-control:focus { outline: none; border-color: var(--accent-teal); }
    .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* Step 3 ─ Installer */
    .installer-container { text-align: center; padding: 40px 0; }
    .install-bar-bg {
      width: 100%; height: 12px; background: rgba(255,255,255,0.05);
      border-radius: 99px; overflow: hidden; margin: 20px 0;
      border: 1px solid var(--border-soft);
    }
    .install-bar-fill {
      height: 100%; width: 0%;
      background: linear-gradient(90deg, var(--accent-teal) 0%, var(--accent-indigo) 100%);
      transition: width 0.4s;
    }
    .install-steps {
      display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
    }
    .install-step-card {
      background: rgba(0,0,0,0.15); border: 1px solid var(--border-soft);
      border-radius: 10px; padding: 16px; text-align: center; font-size: 13px;
    }
    .install-step-card .step-icon { font-size: 22px; display: block; margin-bottom: 6px; }

    /* Step 4 ─ Launcher */
    .launch-console { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .console-card {
      border-radius: 14px; padding: 28px; border: 1px solid var(--border-soft);
      background: rgba(0,0,0,0.15); text-align: center;
    }
    .console-card .card-icon { font-size: 38px; display: block; margin-bottom: 14px; }
    .console-card h4 { font-weight: 800; margin-bottom: 6px; }
    .console-card p  { font-size: 12px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }

    /* ── BUTTONS ── */
    .btn {
      width: 100%; padding: 14px 28px; border-radius: 10px;
      font-weight: 800; font-size: 14px; text-transform: uppercase;
      letter-spacing: 0.05em; border: none; cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      gap: 10px; transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    }
    .btn-teal    { background: var(--accent-teal); color: #000; box-shadow: 0 4px 15px rgba(6,182,212,0.3); }
    .btn-teal:hover    { background: #0891b2; transform: translateY(-1px); }
    .btn-green   { background: var(--accent-green); color: #fff; box-shadow: 0 4px 15px rgba(16,185,129,0.3); }
    .btn-green:hover   { background: #059669; transform: translateY(-1px); }
    .btn-red     { background: var(--accent-red); color: #fff; box-shadow: 0 4px 15px rgba(239,68,68,0.3); }
    .btn-red:hover     { background: #dc2626; transform: translateY(-1px); }
    .btn-secondary {
      background: rgba(255,255,255,0.06); color: #fff;
      border: 1px solid var(--border-soft);
    }
    .btn-secondary:hover { background: rgba(255,255,255,0.1); }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

    /* ── LINK BOX ── */
    .link-box {
      background: rgba(6,182,212,0.05); border: 1px solid rgba(6,182,212,0.18);
      border-radius: 12px; padding: 20px; margin-top: 16px;
      display: flex; justify-content: space-between; align-items: center;
    }
    .link-box a { color: var(--accent-teal); font-weight: 800; text-decoration: none; }
    .link-actions { display: flex; gap: 10px; }
    .link-actions a {
      padding: 8px 16px; border-radius: 6px; font-size: 12px;
      text-decoration: none; font-weight: 800;
    }
    .link-primary   { background: var(--accent-teal); color: #000; }
    .link-secondary { background: rgba(255,255,255,0.06); border: 1px solid var(--border-soft); color: #fff; }

    /* ── LOG TERMINAL ── */
    .log-panel { margin-top: 10px; }
    .log-header {
      display: flex; justify-content: space-between; align-items: center;
      background: #030a12; padding: 10px 18px; border-radius: 10px 10px 0 0;
      font-size: 11px; text-transform: uppercase; font-weight: 800;
      letter-spacing: 0.1em; border: 1px solid var(--border-soft);
      border-bottom: none; color: var(--text-muted);
    }
    .log-console-box {
      background: #020609; border: 1px solid var(--border-soft);
      border-radius: 0 0 10px 10px; height: 280px; overflow-y: auto;
      padding: 15px; font-family: var(--font-mono); font-size: 12px;
      line-height: 1.6; color: #06b6d4; text-align: left;
    }
    .log-row { margin-bottom: 4px; white-space: pre-wrap; word-break: break-all; }
    .log-row .log-time   { color: #2d4a5e; margin-right: 10px; }
    .log-row .log-source {
      background: rgba(255,255,255,0.05); padding: 1px 6px;
      border-radius: 4px; margin-right: 10px; font-size: 10px; font-weight: bold;
    }
    .log-row.source-Launcher .log-source { color: #f59e0b; }
    .log-row.source-Backend  .log-source { color: #06b6d4; }
    .log-row.source-Frontend .log-source { color: #a78bfa; }
    .log-row.source-Installer .log-source { color: #10b981; }

    /* ── WARNING BOX ── */
    .warning-box {
      background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.2);
      border-radius: 12px; padding: 20px; margin-bottom: 20px;
    }
    .warning-box h4 { color: var(--accent-red); font-size: 15px; font-weight: 800; margin-bottom: 6px; }
    .warning-box p  { font-size: 13px; color: var(--text-muted); line-height: 1.4; }

    /* ── DB SUGGESTION ── */
    .db-suggestion {
      background: rgba(6,182,212,0.05); border: 1px solid rgba(6,182,212,0.15);
      border-radius: 12px; padding: 14px 18px; margin-bottom: 16px;
      display: none; justify-content: space-between; align-items: center;
    }
    .db-suggestion strong { color: #fff; font-size: 14px; display: block; }
    .db-suggestion span   { font-size: 12px; color: var(--text-muted); }
    .nav-footer { display: flex; justify-content: space-between; margin-top: 28px; }
  </style>
</head>
<body>

<div class="launcher-shell">

  <!-- HEADER -->
  <header>
    <div class="brand-group">
      <span class="brand-icon">🦷</span>
      <div>
        <h1 class="brand-title">Dentic</h1>
        <p class="brand-sub">Dental Clinic Management System — Control Panel</p>
      </div>
    </div>
    <div class="status-badge">
      <span id="app-status-dot" class="status-dot glowing-red"></span>
      <span id="app-status-text">Stopped</span>
    </div>
  </header>

  <!-- WIZARD CARD -->
  <div class="wizard-card">

    <!-- Step Navigation -->
    <div class="step-navigation">
      <button onclick="gotoStep(1)" id="bullet-1" class="navigation-bullet active-bullet">
        <span class="bullet-digit">1</span> System Check
      </button>
      <button onclick="gotoStep(2)" id="bullet-2" class="navigation-bullet">
        <span class="bullet-digit">2</span> Database Setup
      </button>
      <button onclick="gotoStep(3)" id="bullet-3" class="navigation-bullet">
        <span class="bullet-digit">3</span> Install Packages
      </button>
      <button onclick="gotoStep(4)" id="bullet-4" class="navigation-bullet">
        <span class="bullet-digit">4</span> Launch App
      </button>
    </div>

    <!-- ── STEP 1: Prerequisites ── -->
    <div id="pane-1" class="wizard-pane active-pane">
      <h3 class="pane-title">System Prerequisites Scan</h3>
      <p class="pane-subtitle">Dentic requires Node.js and NPM to run. If anything is missing, click <strong>Auto-Install</strong> to let the launcher handle it automatically via your system package manager.</p>

      <div class="requirement-box">
        <div class="requirement-row">
          <div class="row-meta">
            <h5>Node.js Runtime Engine</h5>
            <p>Powers both the Express REST API and the React development server.</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-install-node" onclick="triggerAutoInstall('node')" class="btn btn-secondary" style="width:auto; padding:6px 12px; font-size:11px; display:none;">Auto-Install</button>
            <div id="node-badge" class="requirement-check">Scanning…</div>
          </div>
        </div>
        <div class="requirement-row">
          <div class="row-meta">
            <h5>NPM Package Manager</h5>
            <p>Downloads and manages Node.js packages for both frontend and backend.</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-install-npm" onclick="triggerAutoInstall('node')" class="btn btn-secondary" style="width:auto; padding:6px 12px; font-size:11px; display:none;">Auto-Install</button>
            <div id="npm-badge" class="requirement-check">Scanning…</div>
          </div>
        </div>
        <div class="requirement-row">
          <div class="row-meta">
            <h5>Git Version Control</h5>
            <p>Optional — enables source control integrations and repository operations.</p>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button id="btn-install-git" onclick="triggerAutoInstall('git')" class="btn btn-secondary" style="width:auto; padding:6px 12px; font-size:11px; display:none;">Auto-Install</button>
            <div id="git-badge" class="requirement-check">Scanning…</div>
          </div>
        </div>
      </div>

      <div id="reqs-warning-box" style="display:none;" class="warning-box">
        <h4>⚠️ Node.js and NPM are required!</h4>
        <p>Click <strong>"Auto-Install"</strong> next to Node.js above, or download it manually:</p>
        <a href="https://nodejs.org" target="_blank" style="display:inline-block; margin-top:12px; color:var(--accent-teal); font-weight:800; font-size:13px; text-decoration:none;">Download Node.js from nodejs.org &rarr;</a>
      </div>

      <div class="nav-footer" style="justify-content:flex-end;">
        <button id="btn-next-1" onclick="gotoStep(2)" class="btn btn-teal" style="width:auto;">Continue to Database Setup &rarr;</button>
      </div>
    </div>

    <!-- ── STEP 2: Database Setup ── -->
    <div id="pane-2" class="wizard-pane">
      <h3 class="pane-title">Configure Database Connection</h3>
      <p class="pane-subtitle">Dentic uses <strong>MySQL</strong> or <strong>PostgreSQL</strong> as its database engine through Sequelize ORM. Select your preferred database and enter the connection credentials.</p>

      <div class="db-cards-grid">
        <div id="card-mysql" onclick="selectDialect('mysql')" class="db-card-option selected-db">
          <span class="db-card-icon">🐬</span>
          <h4>MySQL</h4>
          <span class="db-card-desc">Default &amp; recommended for Dentic.</span>
        </div>
        <div id="card-postgres" onclick="selectDialect('postgres')" class="db-card-option">
          <span class="db-card-icon">🐘</span>
          <h4>PostgreSQL</h4>
          <span class="db-card-desc">Enterprise-grade relational database.</span>
        </div>
      </div>

      <div id="form-network-db" class="db-form-fields">
        <div id="db-suggestion" class="db-suggestion">
          <div>
            <strong id="db-suggestion-msg">Need a local database server?</strong>
            <span id="db-suggestion-sub">You can trigger an automated one-click installation.</span>
          </div>
          <button id="btn-install-db" onclick="triggerDbAutoInstall()" class="btn btn-green" style="width:auto; padding:10px 20px; font-size:12px; margin-left:15px;">Auto-Install DB Server</button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Host / IP Address</label>
            <input type="text" id="db-host" class="form-control" value="localhost" />
          </div>
          <div class="form-group">
            <label>Port</label>
            <input type="text" id="db-port" class="form-control" value="3306" />
          </div>
        </div>
        <div class="form-group">
          <label>Database Name</label>
          <input type="text" id="db-name" class="form-control" value="dentic" />
        </div>
        <div class="form-row-2">
          <div class="form-group">
            <label>Username</label>
            <input type="text" id="db-user" class="form-control" value="root" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" id="db-password" class="form-control" value="" />
          </div>
        </div>
      </div>

      <div class="nav-footer">
        <button onclick="gotoStep(1)" class="btn btn-secondary" style="width:auto;">&larr; Back</button>
        <button onclick="saveDbConfigs()" class="btn btn-teal" style="width:auto;">Save &amp; Continue &rarr;</button>
      </div>
    </div>

    <!-- ── STEP 3: Install Dependencies ── -->
    <div id="pane-3" class="wizard-pane">
      <h3 class="pane-title">Install Dependencies</h3>
      <p class="pane-subtitle">The launcher will run <code style="background:rgba(255,255,255,0.06); padding:2px 6px; border-radius:4px;">npm install</code> inside both the <strong>frontend</strong> (root) and <strong>backend</strong> directories automatically.</p>

      <div class="install-steps">
        <div class="install-step-card">
          <span class="step-icon">⚛️</span>
          <strong>Frontend (React CRA)</strong>
          <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">Root directory packages</p>
        </div>
        <div class="install-step-card">
          <span class="step-icon">🔌</span>
          <strong>Backend (Express API)</strong>
          <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">backend/ directory packages</p>
        </div>
      </div>

      <div class="installer-container" id="install-ui-standard">
        <button id="btn-run-installer" onclick="triggerInstall()" class="btn btn-teal" style="width:auto; padding:16px 44px;">
          📦 Install All Packages
        </button>
      </div>

      <div id="install-ui-active" style="display:none; padding:20px 0;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-weight:800; font-size:14px;">
          <span id="install-status-label" style="color:var(--accent-teal);">Installing… Please wait.</span>
          <span id="install-percent" style="color:var(--accent-green);">0%</span>
        </div>
        <div class="install-bar-bg">
          <div id="install-progress-bar" class="install-bar-fill"></div>
        </div>
        <p style="font-size:12px; color:var(--text-muted); text-align:center;">
          Downloading packages for both directories. This may take 2–4 minutes depending on your network speed.
        </p>
      </div>

      <div class="nav-footer">
        <button onclick="gotoStep(2)" class="btn btn-secondary" style="width:auto;">&larr; Back</button>
        <button id="btn-next-3" onclick="gotoStep(4)" class="btn btn-teal" style="width:auto;" disabled>Go to Launch Panel &rarr;</button>
      </div>
    </div>

    <!-- ── STEP 4: Launch ── -->
    <div id="pane-4" class="wizard-pane">
      <h3 class="pane-title">Application Operations Center</h3>
      <p class="pane-subtitle">Start or stop the Dentic backend API and frontend React application simultaneously with one click.</p>

      <div class="launch-console">
        <div class="console-card">
          <span class="card-icon">🚀</span>
          <h4>Start Dentic</h4>
          <p>Starts the Express REST API on port <strong>5000</strong> and the React dev server on port <strong>3001</strong> simultaneously.</p>
          <button id="btn-control-start" onclick="startApp()" class="btn btn-green">▶ Start Application</button>
        </div>
        <div class="console-card">
          <span class="card-icon">🛑</span>
          <h4>Stop Services</h4>
          <p>Gracefully terminates all background Node.js child processes and frees system ports.</p>
          <button id="btn-control-stop" onclick="stopApp()" class="btn btn-red" disabled>⏹ Stop Application</button>
        </div>
      </div>

      <div id="launched-urls-container" style="display:none;" class="link-box">
        <div>
          <strong style="color:#fff; font-size:15px; display:block;">✅ Dentic is running!</strong>
          <span style="font-size:13px; color:var(--text-muted);">Open the app or explore the API documentation:</span>
        </div>
        <div class="link-actions">
          <a href="http://localhost:3001" target="_blank" class="link-primary">🦷 Open App</a>
          <a href="http://localhost:5000/api-docs" target="_blank" class="link-secondary">📖 API Docs</a>
        </div>
      </div>

      <div class="nav-footer" style="justify-content:flex-start; margin-top:20px;">
        <button onclick="gotoStep(3)" class="btn btn-secondary" style="width:auto;">&larr; Back</button>
      </div>
    </div>

  </div>

  <!-- LOG TERMINAL -->
  <div class="log-panel">
    <div class="log-header">
      <span>🖥 Live Activity Terminal</span>
      <button onclick="clearLogs()" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-weight:800; text-transform:uppercase; font-size:10px; letter-spacing:0.05em;">Clear</button>
    </div>
    <div id="log-terminal" class="log-console-box">
      <div class="log-row source-Launcher"><span class="log-time">00:00:00</span><span class="log-source">Launcher</span>Dentic control panel loaded. Ready for operations.</div>
    </div>
  </div>

</div>

<script>
  let activeStep = 1;
  let selectedDialect = 'mysql';
  let pollCount = 0;

  window.addEventListener('DOMContentLoaded', () => {
    fetchStatus();
    setInterval(fetchStatus, 2000);
    setInterval(pollLogs, 1000);
  });

  function gotoStep(n) {
    if (n === 4 && document.getElementById('btn-next-3').disabled) {
      alert('Please complete Step 3 (Install Packages) before launching the application.');
      return;
    }
    activeStep = n;
    for (let i = 1; i <= 4; i++) {
      document.getElementById('bullet-' + i).classList.toggle('active-bullet', i === n);
      document.getElementById('pane-'   + i).classList.toggle('active-pane',   i === n);
    }
  }

  function selectDialect(dialect) {
    selectedDialect = dialect;
    ['mysql', 'postgres'].forEach(c => {
      document.getElementById('card-' + c).classList.toggle('selected-db', c === dialect);
    });
    const portInput     = document.getElementById('db-port');
    const suggestionBox = document.getElementById('db-suggestion');
    const suggestionMsg = document.getElementById('db-suggestion-msg');

    portInput.value = (dialect === 'mysql') ? '3306' : '5432';
    suggestionBox.style.display = 'flex';
    suggestionMsg.innerText = 'Need to install ' + (dialect === 'mysql' ? 'MySQL' : 'PostgreSQL') + ' locally?';
  }

  async function triggerDbAutoInstall() {
    const btn = document.getElementById('btn-install-db');
    btn.disabled = true; btn.innerText = 'Installing…';
    try {
      const res  = await fetch('/api/auto-install', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ software: selectedDialect }) });
      const data = await res.json();
      alert(data.success ? '✓ Database server installed!' : '❌ Auto-install failed. Please install manually.');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      btn.disabled = false; btn.innerText = 'Auto-Install DB Server';
    }
  }

  async function fetchStatus() {
    try {
      const res  = await fetch('/api/status');
      const data = await res.json();

      // Prerequisites
      renderBadge('node', data.prerequisites.node.installed, data.prerequisites.node.version);
      renderBadge('npm',  data.prerequisites.npm.installed,  data.prerequisites.npm.version);
      renderBadge('git',  data.prerequisites.git.installed,  'Installed');

      const warn = document.getElementById('reqs-warning-box');
      const ok   = data.prerequisites.node.installed && data.prerequisites.npm.installed;
      warn.style.display = ok ? 'none' : 'block';
      document.getElementById('btn-next-1').disabled = !ok;

      // DB config (load once on first poll)
      if (pollCount === 0) {
        selectDialect(data.database.DB_DIALECT || 'mysql');
        document.getElementById('db-host').value     = data.database.DB_HOST     || 'localhost';
        document.getElementById('db-port').value     = data.database.DB_PORT     || '3306';
        document.getElementById('db-name').value     = data.database.DB_NAME     || 'dentic';
        document.getElementById('db-user').value     = data.database.DB_USER     || 'root';
        document.getElementById('db-password').value = data.database.DB_PASSWORD || '';
      }

      // Installer progress
      const btnRun = document.getElementById('btn-run-installer');
      const uiStd  = document.getElementById('install-ui-standard');
      const uiAct  = document.getElementById('install-ui-active');
      const bar    = document.getElementById('install-progress-bar');
      const pct    = document.getElementById('install-percent');
      const lbl    = document.getElementById('install-status-label');

      if (data.isInstalling) {
        btnRun.disabled = true;
        uiAct.style.display = 'block';
        bar.style.width = data.installProgress + '%';
        pct.innerText   = data.installProgress + '%';
      } else if (data.installProgress === 100) {
        bar.style.width = '100%'; pct.innerText = '100% — Done!';
        lbl.innerText = '✓ All packages installed successfully!';
        lbl.style.color = 'var(--accent-green)';
        uiAct.style.display = 'block';
        uiStd.style.display = 'none';
        document.getElementById('btn-next-3').disabled = false;
      } else if (data.depsInstalled) {
        // node_modules already present — skip installation
        bar.style.width = '100%'; pct.innerText = '100%';
        lbl.innerText = '✓ Dependencies already installed — ready to launch!';
        lbl.style.color = 'var(--accent-green)';
        uiAct.style.display = 'block';
        uiStd.style.display = 'none';
        btnRun.disabled = false;
        btnRun.innerText = '🔄 Reinstall Packages';
        document.getElementById('btn-next-3').disabled = false;
      } else {
        btnRun.disabled = false;
      }

      // Running state
      const isRunning = data.running.backend || data.running.frontend;
      document.getElementById('app-status-dot').className  = 'status-dot ' + (isRunning ? 'glowing-green' : 'glowing-red');
      document.getElementById('app-status-text').innerText = isRunning ? 'Running' : 'Stopped';
      document.getElementById('btn-control-start').disabled = isRunning;
      document.getElementById('btn-control-stop').disabled  = !isRunning;
      document.getElementById('launched-urls-container').style.display = isRunning ? 'flex' : 'none';

    } catch (_) {}
  }

  function renderBadge(key, installed, version) {
    const badge = document.getElementById(key + '-badge');
    const btn   = document.getElementById('btn-install-' + key);
    if (installed) {
      badge.innerHTML = '<span class="badge-passed">✓ Passed</span> <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono)">(' + version + ')</span>';
      if (btn) btn.style.display = 'none';
    } else {
      badge.innerHTML = '<span class="badge-missing">❌ Missing</span>';
      if (btn) btn.style.display = 'inline-block';
    }
  }

  async function triggerAutoInstall(software) {
    const btn = document.getElementById('btn-install-' + software);
    if (btn) { btn.disabled = true; btn.innerText = 'Installing…'; }
    try {
      const res  = await fetch('/api/auto-install', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ software }) });
      const data = await res.json();
      alert(data.success ? '✓ ' + software + ' installed!' : '❌ Auto-install failed. Please install ' + software + ' manually.');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.innerText = 'Auto-Install'; }
      fetchStatus();
    }
  }

  async function saveDbConfigs() {
    const payload = {
      DB_DIALECT:  selectedDialect,
      DB_HOST:     document.getElementById('db-host').value,
      DB_PORT:     document.getElementById('db-port').value,
      DB_NAME:     document.getElementById('db-name').value,
      DB_USER:     document.getElementById('db-user').value,
      DB_PASSWORD: document.getElementById('db-password').value,
    };
    try {
      const res  = await fetch('/api/save-db', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const data = await res.json();
      if (data.success) { alert('✓ Database configuration saved!'); gotoStep(3); }
      else               alert('❌ Failed to save configuration.');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  }

  async function triggerInstall() {
    document.getElementById('install-ui-active').style.display = 'block';
    document.getElementById('btn-run-installer').disabled = true;
    try { await fetch('/api/install', { method: 'POST' }); } catch (_) {}
  }

  async function startApp() {
    const btn = document.getElementById('btn-control-start');
    btn.disabled = true;
    btn.innerText = '⏳ Starting…';
    try {
      const res = await fetch('/api/start', { method: 'POST' });
      if (!res.ok) throw new Error('Server returned ' + res.status);
      fetchStatus();
      setTimeout(() => window.open('http://localhost:3001', '_blank'), 5000);
    } catch (err) {
      addLogEntry('Launcher', '❌ Failed to start: ' + err.message);
      btn.disabled = false;
      btn.innerText = '▶ Start Application';
    }
  }

  function addLogEntry(source, text) {
    const box = document.getElementById('log-terminal');
    const row = document.createElement('div');
    row.className = 'log-row source-Launcher';
    const t = document.createElement('span'); t.className = 'log-time'; t.innerText = new Date().toLocaleTimeString();
    const s = document.createElement('span'); s.className = 'log-source'; s.innerText = source;
    row.appendChild(t); row.appendChild(s); row.appendChild(document.createTextNode(text));
    box.appendChild(row);
    box.scrollTop = box.scrollHeight;
  }

  async function stopApp() {
    try { await fetch('/api/stop', { method: 'POST' }); fetchStatus(); } catch (_) {}
  }

  async function pollLogs() {
    try {
      const res  = await fetch('/api/logs');
      const list = await res.json();
      const box  = document.getElementById('log-terminal');

      const nearBottom = box.scrollHeight - box.clientHeight - box.scrollTop < 40;
      box.innerHTML = '';
      list.forEach(item => {
        const row = document.createElement('div');
        row.className = 'log-row source-' + item.source.replace(/\\s+/g, '');
        const t = document.createElement('span'); t.className = 'log-time';   t.innerText = item.timestamp;
        const s = document.createElement('span'); s.className = 'log-source'; s.innerText = item.source;
        row.appendChild(t); row.appendChild(s); row.appendChild(document.createTextNode(item.text));
        box.appendChild(row);
      });
      if (nearBottom && list.length > 0) box.scrollTop = box.scrollHeight;
      pollCount++;
    } catch (_) {}
  }

  async function clearLogs() {
    try {
      await fetch('/api/clear-logs', { method: 'POST' });
      document.getElementById('log-terminal').innerHTML = '';
    } catch (_) {}
  }
</script>
</body>
</html>
`;
}
