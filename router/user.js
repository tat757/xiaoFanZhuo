var router = require('express').Router();
var OAuth = require('OAuth');
var Config = require('electron-config');
var FanfouAPI = require('./fanfouAPI');
var fanfou = new FanfouAPI();
var config = new Config();

router.get('/confirm', function(req, res){
	console.log('confirm');
	if(config.get('access_token')){
		return res.json({success: true, login: true});
	}
	else{
		return res.json({success: true, login: false});
	}
});

router.get('/timeline', function(req, res){
	fanfou.access_token = config.get('access_token');
	fanfou.access_token_secret = config.get('access_token_secret');
	fanfou.getCurrUserHomeTimeline(
		function(err, result, body){
		}, function(body){
			body = JSON.parse(body);
			return res.json({success: true, data: body});
		});
});
module.exports = router;