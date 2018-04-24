var {app, BrowserWindow} = require('electron');// 控制应用生命周期的模块。创建原生浏览器窗口的模块
var path = require('path');

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

var init = function(){
    var windowStyle = {
        width: 500, 
        height: 640,
        autoHideMenuBar: true,
        backgroundColor: 'white',
        resizable: false
    };
    mainWindow = new BrowserWindow(windowStyle);

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function(){
        mainWindow = null;
    });

    mainWindow.loadURL(path.join(__dirname, 'index.html'));
};

app.on('ready', function () {
    console.log('ready');
})
// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on('ready', init);