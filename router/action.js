var router = require('express').Router();
var OAuth = require('OAuth');
var Config = require('electron-config');
var FanfouAPI = require('./fanfouAPI');
var fanfou = new FanfouAPI();
var config = new Config();

router.get('/authorize', function(req, res){
	console.log('/authorize');
	if(config.get('access_token')){
		return res.json({success: true, message: 'Cookie'});
	}
	else{
		console.log('here');
		fanfou.getOAuthRequestToken(function(oauth){
			var redirectUrl = fanfou.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=http://localhost:3000/action/authorize/callback';
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