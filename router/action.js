var router = require('express').Router();
var OAuth = require('OAuth');
var http = require('http');
var fs = require('fs');
var Config = require('electron-config');
var FanfouAPI = require('./fanfouAPI');
var {app} = require('electron');
var fanfou = new FanfouAPI();
var config = new Config();

router.get('/authorize', function(req, res){
	console.log('/authorize');
	if(config.get('access_token')){
		fanfou.access_token = config.get('access_token');
		fanfou.access_token_secret = config.get('access_token_secret');
		return res.json({success: true});
	}
	else{
		console.log('here');
		fanfou.getOAuthRequestToken(function(oauth){
			var redirectUrl = fanfou.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=http://127.0.0.1:3000/action/authorize/callback';
			fanfou.token = oauth.token;
			fanfou.token_secret = oauth.token_secret;
			return res.json({success: true, url: redirectUrl});
		});
	}
});

router.get('/authorize/callback', function(req, res){
	fanfou.getOAuthAccessToken(fanfou.oauth, function(oauth){
		console.log(oauth);
		fanfou.access_token = oauth.access_token;
		fanfou.access_token_secret = oauth.access_token_secret;
		config.set('access_token', oauth.access_token);
		config.set('access_token_secret', oauth.access_token_secret);
		res.redirect('/');
	});
});

router.get('/getCurrUser', function(req, res){
	fanfou.getCurrUser(
		function(err){
			console.log(err);
		},
		function(data){
			data = JSON.parse(data);
			//console.log(data);
			fanfou.userId = data.unique_id;
			fanfou.avatar = data.profile_image_url;
			data.appPath = app.getPath('appData');
			//console.log(data.appPath);
			var saveAvatar = function(callback){
				fs.access(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar/' + fanfou.userId + '.jpg', function(err){
					if(err){
						console.log('here');
						var image = fs.createWriteStream(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar/' + fanfou.userId + '.jpg');
						http.get(data.profile_image_url, function(response){
							response.pipe(image);
							callback(null);
						});
					}
					else{
						callback(null);
					}
				});
			};
			var checkAvatarFolder = function(callback){
				fs.access(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar', function(err){
					if(err){
						fs.mkdir(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar', 0777, function(error){
							if(error){
								callback(error);
							}
							else{
								callback(null);
							}
						});
					}
					else{
						callback(null);
					}
				});
			};
			var checkUserFolder = function(callback){
				fs.access(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId, function(err){
					if(err){
						fs.mkdir(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId, 0777, function(error){
							if(error){
								callback(error);
							}
							else{
								callback(null);
							}
						});
					}
					else{
						callback(null);
					}
				});
			}
			checkUserFolder(function(err){
				if(err){
					return res.json({success: false, data: err});
				}
				else{
					checkAvatarFolder(function(err){
						if(err){
							return res.json({success: false, data: err});
						}
						else{
							saveAvatar(function(err){
								if(err){
									return res.json({success: false, data: err});
								}
								else{
									return res.json({success: true, data: data});
								}
							});
						}
					});
				}
			});
				
			
		});
});

router.get('/getCurrAvatar', function(req, res){
	fs.readFile(app.getPath('appData') + '/xiaoFanZhuo/' + fanfou.userId + '/avatar/' + fanfou.userId + '.jpg', function(err, data){
		if(err){
			return res.json({success: false, data: err});
		}
		else{
			var image = new Buffer(data).toString('base64');
			return res.json({success: true, data: {image: image}});
		}
	});
});

router.get('/logout', function(req, res){
	config.set('access_token', '');
	config.set('access_token_secret', '');
	return res.json({success: true});
});

router.post('/postStatus', function(req, res){
	var text = req.body.text;
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.postStatus(
		{text: text},
		function(error, result, body){
			console.log(result);
			console.log(body);
		},
		function(data){
			data = JSON.parse(data);
			return res.json({success: true});
		});
});

module.exports = router;