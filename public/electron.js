const {app, BrowserWindow} = require('electron')

const path = require('path')
const isDev = require('electron-is-dev')


    function createWindow() {
        const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth:836,
        minHeight:636,
        autoHideMenuBar: true,
        icon: __dirname + '/WSLogoWin.png',
        webPreferences: {
            nodeIntegration: true,
            devTools: false,
        }
    })
    
    mainWindow.loadURL(
    isDev ?
       'http://localhost:3000'
       :
       `file://${path.join(__dirname, '../build/index.html')}`


   )

}

app.whenReady().then(() => {
    createWindow()
  })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})