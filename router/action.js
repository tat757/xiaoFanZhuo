var router = require('express').Router();
var http = require('http');
var fs = require('fs');
var Config = require('electron-config');
var FanfouAPI = require('./fanfouAPI');
var {app} = require('electron');
var fanfou = new FanfouAPI();
var config = new Config();

router.get('/authorize', function(req, res){
	if(config.get('access_token')){
		console.log('Using saved access_token');
		fanfou.access_token = config.get('access_token');
		fanfou.access_token_secret = config.get('access_token_secret');
		return res.json({success: true});
	}
	else{
		console.log('Send request for access_token');
		fanfou.getOAuthRequestToken(function(oauth){
			console.log('Token set.');
			var redirectUrl = fanfou.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=http://127.0.0.1:3000/action/authorize/callback';
			fanfou.token = oauth.token;
			fanfou.token_secret = oauth.token_secret;

			return res.json({success: false, url: redirectUrl});
		});
	}
});

router.get('/authorize/callback', function(req, res){
	fanfou.getOAuthAccessToken(fanfou.oauth, function(oauth){
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
			return res.json({success: true, data: data});
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

router.get('/getCurrUserHomeTimeline', function(req, res){
	fanfou.getCurrUserHomeTimeline(
		function(){

		},
		function(data){
			data = JSON.parse(data);
			return res.json({success: true, data: data});
		}
	);
});

router.get('/logout', function(req, res){
	config.set('access_token', '');
	config.set('access_token_secret', '');
	return res.json({success: true});
});

router.post('/postStatus', function(req, res){
	console.log('/postStatus');
	var data = {};
	if(req.body.isReply){
		data.isReply = true;
		data.replyToUser = req.body.replyToUser;
		data.replyToId = req.body.replyToId;
		data.text = req.body.text;
	} else if (req.body.isRepost) {
		data.isRepost = true;
		data.repostToId = req.body.repostToId;
		data.text = req.body.text;
	} else {
		data.text = req.body.text;
	}
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
			return res.json({success: true});
		});
});

router.post('/destroyStatus', function(req, res){
	console.log('/destroyStatus');
	if(req.body.msgId == undefined){
		return res.json({success: false});
	}
	else{
		var data = req.body;
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
				return res.json({success: true});
			});

	}
});

router.post('/getHomeTimelineBeforeLast', function(req, res){
	var id = req.body.contentId;
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.getHomeTimelineBeforeLast(
		id,
		function(){

		},
		function(data){
			data = JSON.parse(data);
			return res.json({success: true, data: data});
		}
	);
});

router.post('/checkNewTimeline', function(req, res){
	console.log('/checkNewTimeline');
	var id = req.body.firstId;
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.checkNewTimeline(
		id,
		function(){

		},
		function(data){
			data = JSON.parse(data);
			return res.json({success: true, data: data});
		}
	);
});
module.exports = router;