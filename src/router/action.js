var {app} = require('electron');
const BrowserWindow = require('electron').remote.BrowserWindow;
var http = require('http');
var fs = require('fs');
var Config = require('electron-config');
var FanfouAPI = require(path.join(__dirname, '/fanfouAPI.js'));
var fanfou = new FanfouAPI();
var config = new Config();

var Action = function () {
};

Action.prototype.checkToken = function (cb) {
	if (config.get('access_token') !== '') {
		fanfou.access_token = config.get('access_token');
		fanfou.access_token_secret = config.get('access_token_secret');
		return {
			success: true
		}
	} else {
		return {
			success: false,
			message: 'need login'
		}
	}
}

Action.prototype.authorize = function (cb) {
	if(this.checkToken.success){
		return cb({success: true});
	}
	else{
		console.log('Send request for access_token');
		var that = this;
		fanfou.getOAuthRequestToken(function(oauth){
			console.log('Token set.');
			var redirectUrl = fanfou.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=http://127.0.0.1:3000/action/authorize/callback';
			fanfou.token = oauth.token;
			fanfou.token_secret = oauth.token_secret;
			var windowStyle = {
				width: 800,
				height: 600,
				webPreferences: {
					nodeIntegration: false
				}
			};
			var authWindow = new BrowserWindow(windowStyle);
			authWindow.loadURL(redirectUrl);
			authWindow.show();
			authWindow.webContents.on('did-get-redirect-request', function (e, oldUrl, newUrl) {
				that.authorizeCallback(newUrl, function () {
					authWindow.destroy();
					cb();
				})
			})
		});
	}
};

Action.prototype.authorizeCallback = function (url, cb) {
	fanfou.getOAuthAccessToken(fanfou.oauth, function(oauth){
		fanfou.access_token = oauth.access_token;
		fanfou.access_token_secret = oauth.access_token_secret;
		config.set('access_token', oauth.access_token);
		config.set('access_token_secret', oauth.access_token_secret);
		cb();
	});
};

Action.prototype.getCurrUser = function(cb){
	fanfou.getCurrUser(
		function(err){
			console.log(err);
		},
		function(data){
			data = JSON.parse(data);
			//console.log(data);
			fanfou.userId = data.unique_id;
			fanfou.avatar = data.profile_image_url;
			cb({success: true, data: data});
		});
};

Action.prototype.getCurrAvatar = function(cb){
	fs.readFile(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar/' + fanfou.userId + '.jpg', function(err, data){
		if(err){
			cb({success: false, data: err});
		}
		else{
			var image = new Buffer(data).toString('base64');
			cb({success: true, data: {image: image}});
		}
	});
};

Action.prototype.getCurrUserHomeTimeline = function(cb){
	fanfou.getCurrUserHomeTimeline(
		function(){

		},
		function(data){
			data = JSON.parse(data);
			cb({success: true, data: data});
		}
	);
};

Action.prototype.logout = function(cb){
	config.set('access_token', '');
	config.set('access_token_secret', '');
	cb({success: true});
};

Action.prototype.postStatus = function (data, cb) {
	console.log('/postStatus');
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.postStatus(
		data,
		function(error, result, body){
			console.log(result);
			console.log(body);
		},
		function(data){
			data = JSON.parse(data);
			cb({success: true});
		});
};

Action.prototype.destroyStatus = function (data, cb) {
	console.log('/destroyStatus');
	if(!data.msgId){
		cb({success: false, message: 'need msgId'});
	}
	else{
		var data = {msgId: data.msgId};
		fanfou.access_token = config.get('access_token');
		fanfou.access_token_secret = config.get('access_token_secret');
		fanfou.destroyStatus(
			data,
			function(error, result, body){
				console.log(result);
				console.log(body);
			},
			function(data){
				data = JSON.parse(data);
				cb({success: true});
			});
	}
};

Action.prototype.favoriteStatus = function (data, cb) {
	console.log('/favoriteStatus');
	if(!data.msgId){
		cb({success: false, message: 'need msgId'});
	}
	else{
		var query = {msgId: data.msgId, state: data.state};
		fanfou.access_token = config.get('access_token');
		fanfou.access_token_secret = config.get('access_token_secret');
		fanfou.favoriteStatus(
			query,
			function(error, result, body){
				console.log(result);
				console.log(body);
			},
			function(res){
				res = JSON.parse(res);
				cb({success: true});
			});
	}
};
Action.prototype.getHomeTimelineBeforeLast = function (data, cb){
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.getHomeTimelineBeforeLast(
		data.contentId,
		function(){

		},
		function(data){
			data = JSON.parse(data);
			cb({success: true, data: data});
		}
	);
};

Action.prototype.checkNewTimeline = function (data, cb){
	console.log('/checkNewTimeline');
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.checkNewTimeline(
		data.firstId,
		function(){

		},
		function(data){
			data = JSON.parse(data);
			cb({success: true, data: data});
		}
	);
};
module.exports = Action;