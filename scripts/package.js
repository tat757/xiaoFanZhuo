var packager = require('electron-packager');
var package = require('../package.json');
var path = require('path');
var devPackage = Object.keys(package.devDependencies);

var options = {
    dir: './',
    name: 'xiaoFanZhuo',
    asar: true,
    overwrite: true,
    'app-version': package.version,
    ignore: [
        '/scripts',
        '.vscode',
        '.gitignore',
        '/xiaoFanZhuo-win32-ia32',
        '/xiaoFanZhuo-win32-x64',
        '/installer'
    ]
}

var pack = function (platform, arch, cb) {
    var icon = path.join(__dirname, '/../assets/icons/logo');
    var extension = '.png';
    if (platform === 'darwin') {
        extension = '.icns';
    } else if (platform === 'win32') {
        extension = '.ico';
    }
    options.icon = icon + extension;
    console.log(options.icon);
    options.platform = platform;
    options.arch = arch;

    packager(options, function (err, path) {
        if (err) {
            console.log(err);
        }
        console.log(platform + ' pack finished');
    })
}

pack('win32', 'x64');