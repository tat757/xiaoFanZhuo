var OAuth = require('OAuth').OAuth;
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
	this.oauth = new OAuth(
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

FanfouAPI.prototype.getRequest = function(url, failed, success){
	this.oauth.get(url, this.access_token, this.access_token_secret, function(err, body, res){
		if(!err && res.statusCode == 200){
			success(body);
		}
		else{
			failed(err, res, body);
		}
	});
};

FanfouAPI.prototype.postRequest = function(url, data, failed, success){
	this.oauth.post(url, this.access_token, this.access_token_secret, data, function(err, body, res){
		if(!err && res.statusCode == 200){
			success(body);
		}
		else{
			failed(err, res, body);
		}
	});
};

module.exports = FanfouAPI; 