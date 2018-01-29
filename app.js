var electron = require('electron');
var path = require('path');
var url = require('url');
var app = electron.app;  // 控制应用生命周期的模块。
var BrowserWindow = electron.BrowserWindow;  // 创建原生浏览器窗口的模块

var express = require('express');
var bodyParser = require('body-parser');
var oauth =  require('oauth');
var expressApp = express();

var action = require('./router/action');
var index = require('./router/index');

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

var init = function(){
    var windowStyle = {
        width: 500, 
        height: 640,
        autoHideMenuBar: true,
        backgroundColor: 'white'
    };
    mainWindow = new BrowserWindow(windowStyle);

    mainWindow.webContents.openDevTools();

    expressApp.set('views', path.join(__dirname));
    expressApp.set('view engine', 'ejs');
    expressApp.use(bodyParser.json());
    expressApp.use(bodyParser.urlencoded({ extended: false }));
    
    expressApp.use('/', index);
    expressApp.use('/page', express.static(__dirname + '/views'));
    expressApp.use('/src', express.static(__dirname + '/src'));
    expressApp.use('/module', express.static(__dirname + '/node_modules'));

    expressApp.use('/action', action);

    expressApp.use(function(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000/');
        next();
    });

    mainWindow.on('closed', function(){
        mainWindow = null;
    });

    expressApp.listen(3000, function(){
        console.log('Port 3000 is running');
    });

    mainWindow.loadURL('http://127.0.0.1:3000/');
};

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on('ready', init);