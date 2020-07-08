import { app, BrowserWindow, Tray, Menu } from 'electron'
const log = require('electron-log')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
} else {
  global.__static = __static
}

let mainWindow = null
let appIcon = null
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  log.info('createWindow called')
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 521, 
    height: 640,
    autoHideMenuBar: true,
    backgroundColor: 'white',
    resizable: false,
    icon: require('path').join(global.__static, 'icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  // setting tray
  appIcon = new Tray(require('path').join(global.__static, 'icon.ico'))
  const menu = Menu.buildFromTemplate([{
    label: '退出',
    click: () => {
        mainWindow.destroy()
        app.quit()
      }
    }
  ])
  appIcon.setToolTip('小饭桌')
  appIcon.setContextMenu(menu)
  appIcon.on('click', (e) => {
    mainWindow.show()
  })
  log.info('ready to load url')
  log.info(winURL)
  mainWindow.loadURL(winURL)
  log.info('done to load url')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
