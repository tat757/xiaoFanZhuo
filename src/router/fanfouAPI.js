var OAuth = require('oauth');
var CONFIG = require(path.join(__dirname, '/../config'));
var request = require('request');
var fs = require('fs');
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
	var theOauth = this.oauth;
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
			theOauth.token = oauth_token;
			theOauth.token_secret = oauth_token_secret;

			next(oauth);
		}
	});
};

FanfouAPI.prototype.getOAuthAccessToken = function(oauth, next){
	var theOauth = this.oauth;
	this.oauth.getOAuthAccessToken(this.token, this.token_secret, oauth.verifier, function(err, access_token, access_token_secret, results){
		if(err){
			console.log('OAUTH ACCESS ERROR: ' + err);
			next();
		}
		else{
			oauth.access_token = access_token;
			oauth.access_token_secret = access_token_secret;

			theOauth.access_token = access_token;
			theOauth.access_token_secret = access_token_secret;

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
	var parameter = {};
	var url = '';
	if (data.hasImage) {
		path = '/photos/upload.json'
		parameter = {
			photo: fs.createReadStream(data.image),
			status: data.text
		}
		url = this.apiBaseURL + path;
		this.uploadRequest(url, parameter, err, res);
	} else {
		if(data.isReply){
			parameter = {"status" : data.text,
						 "in_reply_to_status_id" : data.replyToId,
						 "in_reply_to_user_id" : data.replyToUser};
		} else if (data.isRepost) {
			parameter = {
				"status": data.text,
				"repost_status_id": data.repostToId
			};
		} else {
			parameter = {"status": data.text };
		}
		url = this.apiBaseURL + path;
		this.postRequest(url, parameter, err, res);
	}
};


FanfouAPI.prototype.destroyStatus = function(data, err, res){
	var path = '/statuses/destroy.json';
	var parameter;
	parameter = {"id": data.msgId };
	var url = this.apiBaseURL + path;
	this.postRequest(url, parameter, err, res);
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

FanfouAPI.prototype.uploadRequest = function (url, data, err, res) {
	var that = this;
	var oauth = {
		consumer_key: this.consumerKey,
		consumer_secret: this.consumerSecret,
		token: this.access_token,
		token_secret: this.access_token_secret
	}
	request({
			method: 'POST',
			url: url,
			formData: data,
			oauth: oauth
		},
		function (error, response, body) {
			if (error) {
				console.log(error);
				err(error, response, body);
			} else {
				res(body);
			}
		})
};

module.exports = FanfouAPI; 