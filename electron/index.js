const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const waitOn = require("wait-on");
const path = require("path");

let backendProcess;
let frontendProcess;

async function createWindow() {
  // Path to venv python
  const pythonPath = app.isPackaged
    ? path.join(process.resourcesPath, "backend/venv/bin/python3") // packaged
    : path.join(__dirname, "../backend/venv/bin/python3");         // dev mode

  // Start backend
  backendProcess = spawn(pythonPath, ["-m", "app.main"], {
    cwd: app.isPackaged
      ? path.join(process.resourcesPath, "backend")
      : path.join(__dirname, "../backend"),
    shell: true,
  });

  backendProcess.stdout.on("data", (data) => console.log(`Backend: ${data}`));
  backendProcess.stderr.on("data", (data) => console.error(`Backend error: ${data}`));

  if (app.isPackaged) {
    // Production → wait for backend
    await waitOn({ resources: ["http://localhost:8000"], timeout: 30000 });
  } else {
    // Dev → start npm run dev
    frontendProcess = spawn("npm", ["run", "dev"], {
      cwd: path.join(__dirname, "../frontend"),
      shell: true,
    });
    frontendProcess.stdout.on("data", (data) => console.log(`Frontend: ${data}`));
    frontendProcess.stderr.on("data", (data) => console.error(`Frontend error: ${data}`));

    await waitOn({ resources: ["http://localhost:5173"], timeout: 30000 });
  }

  const win = new BrowserWindow({ width: 1200, height: 800 });
  win.loadURL(app.isPackaged ? "http://localhost:8000" : "http://localhost:5173");

  win.on("closed", () => {
    backendProcess.kill();
    if (frontendProcess) frontendProcess.kill();
  });
}

app.whenReady().then(createWindow);
