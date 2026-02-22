const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: 'icon.ico',
    webPreferences: {
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false); // إخفاء القوائم العلوية
}

app.whenReady().then(createWindow);