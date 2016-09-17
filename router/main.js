var router = require('express').Router();
var OAuth = require('OAuth');
var Config = require('electron-config');
var FanfouAPI = require('./fanfouAPI');
var fanfou = new FanfouAPI();
var config = new Config();

router.get('/', function(req, res){
	res.render('index');
});

router.get('/authorize', function(req, res){
	console.log('clicked');
	if(config.get('access_token')){
		res.redirect('/timeline');
	}
	else{
		fanfou.getOAuthRequestToken(function(oauth){
			var redirectUrl = fanfou.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=' + 'http://127.0.0.1:3000/authorize/callback';
			fanfou.token = oauth.token;
			fanfou.token_secret = oauth.token_secret;
			console.log(redirectUrl);
			res.redirect(redirectUrl);
		});
	}
});

router.get('/authorize/callback', function(req, res, next){
	console.log('callback');
	fanfou.getOAuthAccessToken(fanfou.oauth, function(oauth){
		console.log(oauth);
		fanfou.access_token = oauth.access_token;
		fanfou.access_token_secret = oauth.access_token_secret;
		config.set('access_token', oauth.access_token);
		config.set('access_token_secret', oauth.access_token_secret);
		res.redirect('/timeline');
	});
});

router.get('/timeline', function(req, res){
	res.render('timeline');
});

router.get('/timeline/post', function(req, res){
	console.log('posted');
});
module.exports = router;