import { app, BrowserWindow, Tray, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let appIcon
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.ejs`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 521, 
    height: 640,
    autoHideMenuBar: true,
    backgroundColor: 'white',
    resizable: false
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  // setting tray
  appIcon = new Tray(require('path').join('./static/icon.ico'))
  const menu = Menu.buildFromTemplate([{
    label: '退出',
    click: () => {
        app.quit()
        mainWindow = null
      }
    }
  ])
  appIcon.setToolTip('小饭桌')
  appIcon.setContextMenu(menu)
  appIcon.on('click', (e) => {
    mainWindow.show()
  })
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
