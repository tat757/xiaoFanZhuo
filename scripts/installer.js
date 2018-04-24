var installer = require('electron-winstaller');
var path = require('path');

var result = installer.createWindowsInstaller({
    appDirectory: './xiaoFanZhuo-win32-ia32',
    noMsi: true
})

result.then(function () {
    console.log('installer created');
}, function (err) {
    console.log('installer error');
    console.log(err);
})