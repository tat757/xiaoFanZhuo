const OAuth = require('oauth')
const Store = require('electron-store')
const Fanfou = require('fanfou-sdk')
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const fs = require('fs')

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

fanfou.cacheData = {
	home_timeline: {
		data: null,
		since_id: null
	},
	mentions: {
		data: null,
		since_id: null
	},
	hasNew: false
}

let timeout = null
const requesting = {
	home_timeline: false,
	mentions: false
}

const fetchHomeTimeline = (isInterval) => {
	const params = {
		format: 'html'
	}
	if (isInterval) {
		params.since_id = fanfou.cacheData.home_timeline.since_id
	} else {
		params.count = 15
	}
	return new Promise((resolve, reject) => {
		if (requesting.home_timeline) {
			resolve()
		} else {
			requesting.home_timeline = true
			fanfou.get('/statuses/home_timeline', params).then((res) => {
				requesting.home_timeline = false
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		}
	})
}

const fetchMentions = (isInterval) => {
	const params = {
		format: 'html'
	}
	if (isInterval) {
		params.since_id = fanfou.cacheData.mentions.since_id
	} else {
		params.count = 15
	}
	return new Promise((resolve, reject) => {
		if (requesting.mentions) {
			resolve()
		} else {
			requesting.mentions = true
			fanfou.get('/statuses/mentions', params).then(res => {
				requesting.mentions = false
				resolve(res)
			}).catch(e => {
				reject(e)
			})
		}
	})
}

const fetchMoreDataPromise = (promises) => {
	return Promise.allSettled(promises)
}

const fetchMoreData = () => {
	const isInterval = true
	const promises = [
		fetchHomeTimeline(isInterval),
		fetchMentions(isInterval)
	]
	const nextFetching = () => {
		timeout = setTimeout(() => {
			fetchMoreDataPromise(promises).then(res => {
				let data = null
				if (res[0]) {
					data = fanfou.cacheData.home_timeline.data || []
					data = res[0].concat(data)
					fanfou.cacheData.home_timeline.since_id = data[0][0].id
				}
				if (res[1]) {
					data = fanfou.cacheData.mentions.data || []
					data = res[1].concat(data) 
					fanfou.cacheData.mentions.since_id = data[1][0].id
				}
				if (data) {
					fanfou.cacheData.hasNew = true
				}
				if (timeout) {
					nextFetching()
				}
			})
		}, 15 * 1000)
	}
	nextFetching()
}

Fanfou.prototype.initData = function () {
	const params = {
		format: 'html',
		count: 15
	}
	const promises = [
		fetchHomeTimeline(),
		fetchMentions()
	]
	return new Promise(function (resolve, reject) {
		Promise.all(promises).then(function (res) {
			fetchMoreData()
			const returnData = {
				home_timeline: res[0],
				mentions: res[1]
			}
			if (res[0]) {
				fanfou.cacheData.home_timeline.since_id = res[0][0] ? res[0][0].id : null
			}
			if (res[1]) {
				fanfou.cacheData.mentions.since_id = res[1][0] ? res[1][0].id : null
			}
			resolve(returnData)
		})
	})
}

Fanfou.prototype.getOAuthRequestToken = function (next) {
	this.oauth.getOAuthRequestToken(
		(err, oauth_token, oauth_token_secret, results) => {
			if(err){
				console.log('OAUTH REQUEST ERROR: ' + err)
				next()
			}
			else{
				const oauth = {
					token: oauth_token,
					token_secret: oauth_token_secret
				}
				this.oauth.token = oauth_token
				this.oauth.token_secret = oauth_token_secret
				next(oauth)
			}
		}
	)
}

Fanfou.prototype.getOAuthAccessToken  = function (oauth, next) {
	this.oauth.getOAuthAccessToken(
		this.token,
		this.token_secret,
		oauth.verifier,
		(err, access_token, access_token_secret, results) => {
			if(err){
				console.log('OAUTH ACCESS ERROR: ' + err)
				next()
			}
			else{
				oauth.access_token = access_token
				oauth.access_token_secret = access_token_secret

				this.oauthToken = access_token
				this.oauthTokenSecret = access_token_secret

				next(oauth)
			}
		}
	)
}

Fanfou.prototype.checkToken = function (cb) {
	if (store.get('access_token') && store.get('access_token') !== '') {
		this.oauthToken = store.get('access_token')
		this.oauthTokenSecret = store.get('access_token_secret')
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

Fanfou.prototype.authorizeCallback = function (url, cb) {
	this.getOAuthAccessToken(this.oauth, (oauth) => {
		this.oauthToken = oauth.access_token
		this.oauthTokenSecret = oauth.access_token_secret
		store.set('access_token', oauth.access_token)
		store.set('access_token_secret', oauth.access_token_secret)
		cb()
	})
}

Fanfou.prototype.authorize = function (cb) {
	const that = this
  if(this.checkToken().success){
		return cb({success: true})
	}
	else{
		this.getOAuthRequestToken((oauth) => {
      const href = window.location.href
			const redirectUrl = config.authorizeURL
												+ '?oauth_token=' + oauth.token
												+ '&oauth_callback='
												+ href.substring(0, href.indexOf('?'))
												+ '/action/authorize/callback'
			this.token = oauth.token
			this.token_secret = oauth.token_secret
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
			authWindow.webContents.on('will-redirect', (e, newUrl) => {
				this.authorizeCallback(newUrl, () => {
					authWindow.destroy()
					cb()
				})
			})
		})
	}
}

Fanfou.prototype.logout = function () {
	return new Promise((resolve, reject) => {
		store.set('access_token', '')
		store.set('access_token_secret', '')
		this.cacheData = {}
		resolve()
	})
}

Fanfou.prototype.uploadPhoto = function (params) {
	params.photo = fs.createReadStream(params.photo.path)
	return new Promise((resolve, reject) => {
		this.post('/photos/upload', params).then((res) => {
			resolve(res)
		}).catch((err) => {
			console.log(err)
		})
	})
}

const getRequestType = (url) => {
	let type = 'regular'
	switch(url) {
		case '/statuses/home_timeline': {
			type = 'home_timeline'
			break
		}
		case '/statuses/mentions': {
			type = 'mentions'
			break
		}
	}
	return type
}

const getRequestMethod = (url) => {
	switch(url.split('/')[1]) {
		case 'create':
		case 'destroy':
		case 'update':
			return 'post'
	}
	return 'get'
}

const checkHasNew = () => {
	const cache = fanfou.cacheData
	const length = cache.home_timeline.data.length + cache.mentions.data.length
	fanfou.cacheData.hasNew = length > 0
}

Fanfou.prototype.fetchData = function (url, params) {
	let type = 'regular'
	if (params.since_id) {
		type = getRequestType(url)
	}
	const method = getRequestMethod(url)
	return new Promise((resolve, reject) => {
		if (type === 'regular') {
			fanfou[method](url, params).then(res => {
				resolve(res)
			})
		} else {
			resolve(fanfou.cacheData[type])
		}
	})
}

Fanfou.prototype.cleanCache = function (type) {
	this.cacheData[type].data = []
	checkHasNew()
}

export default fanfou
