var installer = require('electron-winstaller');
var path = require('path');

var result = installer.createWindowsInstaller({
    appDirectory: './xiaoFanZhuo-win32-x64',
    setupExe: 'xiaofanzhuo.exe',
    iconUrl: path.join(__dirname, '/../assets/icons/logo'),
    noMsi: true
})

result.then(function () {
    console.log('installer created');
}, function (err) {
    console.log('installer error');
    console.log(err);
})