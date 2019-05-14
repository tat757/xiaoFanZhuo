const OAuth = require('oauth')
const Store = require('electron-store')
const Fanfou = require('fanfou-sdk')
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

const config = require('../../config')

const store = new Store()
const fanfou = new Fanfou({
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret,
  oauthToken: store.get('access_token') || '',
  oauthTokenSecret: store.get('access_token_secret') || ''
})

fanfou.oauth = new OAuth.OAuth(
	config.requestTokenURL,
	config.accessTokenURL,
	config.consumerKey,
	config.consumerSecret,
	'1.0',
	null,
	'HMAC-SHA1',
	null,
	null
)

Fanfou.prototype.getOAuthRequestToken = (next) => {
	fanfou.oauth.getOAuthRequestToken((err, oauth_token, oauth_token_secret, results) => {
		if(err){
			console.log('OAUTH REQUEST ERROR: ' + err)
			next()
		}
		else{
			const oauth = {
				token: oauth_token,
				token_secret: oauth_token_secret
			}
			fanfou.oauth.token = oauth_token
			fanfou.oauth.token_secret = oauth_token_secret
			next(oauth)
		}
	})
}
Fanfou.prototype.getOAuthAccessToken  = (oauth, next) => {
	fanfou.oauth.getOAuthAccessToken(fanfou.token, fanfou.token_secret, oauth.verifier, (err, access_token, access_token_secret, results) => {
		if(err){
			console.log('OAUTH ACCESS ERROR: ' + err)
			next()
		}
		else{
			oauth.access_token = access_token
			oauth.access_token_secret = access_token_secret

			fanfou.oauthToken = access_token
			fanfou.oauthTokenSecret = access_token_secret

			next(oauth)
		}
	})
}
Fanfou.prototype.checkToken = (cb) => {
	if (store.get('access_token') !== '') {
		fanfou.oauthToken = store.get('access_token')
		fanfou.oauthTokenSecret = store.get('access_token_secret')
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
Fanfou.prototype.authorizeCallback = (url, cb) => {
	fanfou.getOAuthAccessToken(fanfou.oauth, function(oauth){
		fanfou.oauthToken = oauth.access_token
		fanfou.oauthTokenSecret = oauth.access_token_secret
		store.set('access_token', oauth.access_token)
		store.set('access_token_secret', oauth.access_token_secret)
		cb()
	})
}
Fanfou.prototype.authorize = (cb) => {
  if(fanfou.checkToken().success){
		return cb({success: true})
	}
	else{
		fanfou.getOAuthRequestToken((oauth) => {
			const redirectUrl = config.authorizeURL + '?oauth_token=' + oauth.token + '&oauth_callback=http://127.0.0.1:9080/action/authorize/callback'
			fanfou.token = oauth.token
			fanfou.token_secret = oauth.token_secret
			const windowStyle = {
				width: 800,
				height: 600,
				webPreferences: {
					nodeIntegration: false
				}
			}
			const authWindow = new BrowserWindow(windowStyle)
			authWindow.loadURL(redirectUrl)
			authWindow.show()
			authWindow.webContents.on('did-get-redirect-request', (e, oldUrl, newUrl) => {
				fanfou.authorizeCallback(newUrl, function () {
					authWindow.destroy()
					cb()
				})
			})
		})
	}
}
Fanfou.prototype.logout = () => {
	return new Promise((resolve, reject) => {
		store.set('access_token', '')
		store.set('access_token_secret', '')
		resolve()
	})
}
export default fanfou
