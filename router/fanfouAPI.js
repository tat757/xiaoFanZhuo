var OAuth = require('oauth');
var CONFIG = require('../config');
var FANFOU_URL = {
	REQUEST_TOKEN_URL: 'http://fanfou.com/oauth/request_token',
	ACCESS_TOKEN_URL: 'http://fanfou.com/oauth/access_token',
	AUTHORIZE_URL: 'http://fanfou.com/oauth/authorize',
	BASE_URL: 'http://api.fanfou.com'
};

var FanfouAPI = function(){
	this.consumerKey = CONFIG.CONSUMER_KEY;
	this.consumerSecret = CONFIG.CONSUMER_SECRET;
	this.requestTokenURL = FANFOU_URL.REQUEST_TOKEN_URL;
	this.accessTokenURL = FANFOU_URL.ACCESS_TOKEN_URL;
	this.authorizeURL = FANFOU_URL.AUTHORIZE_URL;
	this.apiBaseURL = FANFOU_URL.BASE_URL;
	this.oauth = new OAuth.OAuth(
		this.requestTokenURL,
		this.accessTokenURL,
		this.consumerKey,
		this.consumerSecret,
		'1.0',
		null,
		'HMAC-SHA1',
		null,
		null
	);
};

FanfouAPI.prototype.getOAuthRequestToken = function(next){
	this.oauth.getOAuthRequestToken(function(err, oauth_token, oauth_token_secret, results){
		if(err){
			console.log('OAUTH REQUEST ERROR: ' + err);
			next();
		}
		else{
			var oauth = {
				token: oauth_token,
				token_secret: oauth_token_secret
			};

			this.token = oauth_token;
			this.token_secret = oauth_token_secret;

			next(oauth);
		}
	});
};

FanfouAPI.prototype.getOAuthAccessToken = function(oauth, next){
	this.oauth.getOAuthAccessToken(this.token, this.token_secret, oauth.verifier, function(err, access_token, access_token_secret, results){
		if(err){
			console.log('OAUTH ACCESS ERROR: ' + err);
			next();
		}
		else{
			oauth.access_token = access_token;
			oauth.access_token_secret = access_token_secret;

			this.access_token = access_token;
			this.access_token_secret = access_token_secret;

			next(oauth);
		}
	});
};

FanfouAPI.prototype.getCurrUserHomeTimeline = function(err, res){
	var path = '/statuses/home_timeline.json?count=10';
	var url = this.apiBaseURL + path;
	this.getRequest(url, err, res);
};

FanfouAPI.prototype.getCurrUser = function(err, res){
	var path = '/users/show.json';
	var url = this.apiBaseURL + path;
	this.getRequest(url, err, res);
};

FanfouAPI.prototype.postStatus = function(data, err, res){
	var path = '/statuses/update.json';
	var data = {"status": data.text };
	var url = this.apiBaseURL + path;
	this.postRequest(url, data, err, res);
};

FanfouAPI.prototype.getHomeTimelineBeforeLast = function(lastId, err, res){
	var path = '/statuses/home_timeline.json?count=10&max_id=' + lastId;
	var url = this.apiBaseURL + path;
	this.getRequest(url, err, res);
};

FanfouAPI.prototype.checkNewTimeline = function(firstId, err, res){
	var path = '/statuses/home_timeline.json?since_id=' + firstId;
	var url = this.apiBaseURL + path;
	this.getRequest(url, err, res);
};

FanfouAPI.prototype.getRequest = function(url, err, res){
	console.log(this.access_token);
	console.log(this.access_token_secret);
	this.oauth.get(url, this.access_token, this.access_token_secret, function(error, body, result){
		if(!error && result.statusCode == 200){
			res(body);
		}
		else{
			err(error, result, body);
		}
	});
};

FanfouAPI.prototype.postRequest = function(url, data, err, res){
	this.oauth.post(url, this.access_token, this.access_token_secret, data, function(error, body, result){
		if(!error && result.statusCode == 200){
			res(body);
		}
		else{
			err(error, result, body);
		}
	});
};

module.exports = FanfouAPI; 