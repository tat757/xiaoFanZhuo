var electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var path = require('path');
var Action = require(path.join(__dirname, '/router/action'));
var action = new Action();

console.log(electron.remote.getGlobal('updater'));
console.log('updater = ', electron.remote.getGlobal('updater').success);

// this event is used to show large image when user clicks an image in a message
window.addEventListener('click', function (e) {
	if (e.target.nodeName === 'IMG' && e.target.dataset.largeurl) {
		let largePhoto = new Image();
		largePhoto.onload = function () {
			let win = new BrowserWindow({
				width: largePhoto.width,
				height: largePhoto.height,
				autoHideMenuBar: true,
				backgroundColor: 'white'
			});
			win.on('close', function () {
				win = null;
			});
			win.loadURL(largePhoto.src);
		};
		largePhoto.src = e.target.dataset.largeurl;
	}
});

var XFZ = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		},
		input: {
			isReply: false,
			replyToId: '',
			replyToUser: '',
			replyToUsername: '',
			isRepost: false,
			repostToId: '',
			image: null,
			hasImage: false
		},
		timeline: {
			data: [],
			unread: [],
			unreadCount: 0,
			cache: {},
			count: 0,
			first: '',
			last: ''
		},
		alertTimer: null,
		nav : 'home',
		notMain : false,
		loadingContent : false
	},
	init : function(){
		document.body.style.overflowY = 'hidden';
		XFZ.status.page = 'welcome';
		XFZ.renderPage();
	},
	renderPage : function(){
		container.innerHTML = '';
		switch(XFZ.status.page){
			case 'welcome' : 
				XFZ.page.welcome();
				break;
			case 'login' :
				XFZ.page.login();
				break;
			case 'logout' :
				XFZ.page.logout();
				break;
			case 'main' :
				XFZ.page.main();
				break;
		}
	},
	renderInput : function(){
		var inputContainer = document.createElement('div');
		inputContainer.id = 'inputContainer';
		inputContainer.classList.add('t-input-container');

		var currUserAvatar = document.createElement('img');
		currUserAvatar.id = 'currUserAvatar';
		currUserAvatar.classList.add('t-avatar');
		
		var avatarBlock = document.createElement('div');
		avatarBlock.id = 'avatarBlock';
		avatarBlock.classList.add('t-avatar-block');
		avatarBlock.appendChild(currUserAvatar);

		var logoutButton = document.createElement('input');
		logoutButton.id = 'logoutButton';
		logoutButton.type = 'button';
		logoutButton.value = '登出'; // TODO: replace with power image
		logoutButton.className = 't-xs-font';
		logoutButton.onclick = function (e) {
			var target = e.target;
			XFZ.status.page = 'logout';
			XFZ.renderPage();
		};

		var featureBlock = document.createElement('div');
		featureBlock.id = 'featureBlock';
		featureBlock.appendChild(logoutButton);

		var letterCounter = document.createElement('div');
		letterCounter.id = 'letterCounter';
		letterCounter.className = 't-letter-counter darkFont';
		letterCounter.textContent = '140';

		var avatarContainer = document.createElement('div');
		avatarContainer.classList.add('t-avatar-container');
		avatarContainer.appendChild(avatarBlock);
		avatarContainer.appendChild(letterCounter);
		avatarContainer.appendChild(featureBlock);

		var textarea = document.createElement('textarea');
		textarea.id = 'inputTextarea';
		textarea.classList.add('t-input-textarea');

		textarea.addEventListener('focus', function (e) {
			var uploadImage = document.getElementById('uploadImage');
			if (uploadImage.classList.contains('t-hidden')) {
				uploadImage.classList.toggle('t-hidden');
			}
		});

		textarea.addEventListener('input', function (e) {
			var inputTextarea = document.getElementById('inputTextarea');
			var counter = document.getElementById('letterCounter');
			counter.classList.remove('warningFont', 'dangerFont', 'darkFont');
			if (inputTextarea.value === '') {
				XFZ.resetInput();
				counter.textContent = '140';
				counter.classList.add('darkFont')
			} else {
				counter.textContent = 140 - inputTextarea.value.length;
				if (+counter.textContent < 50 && +counter.textContent > 0) {
					counter.classList.add('warningFont')
				} else if (+counter.textContent <= 0) {
					counter.classList.add('dangerFont')
				} else {
					counter.classList.add('darkFont')
				}
			}
		});
		var uploadContainer = document.createElement('div');
		
		var uploadImage = document.createElement('input');
		uploadImage.type = 'button';
		uploadImage.value = '上传图片';
		uploadImage.id = 'uploadImage';
		uploadImage.classList.add('t-right-button');
		uploadImage.classList.add('t-hidden');
		uploadImage.classList.add('t-fl');
		uploadImage.addEventListener('click', function () {
			document.getElementById('realUploadButton').click();
		});
		uploadContainer.appendChild(uploadImage);

		var imageNameContainer = document.createElement('p');
		imageNameContainer.id = 'imageNameContainer';
		imageNameContainer.className = 't-hidden t-sm-font t-fl grey';
		var imageName = document.createElement('span');
		imageName.id = 'imageName';
		imageName.classList.add('t-ml-5');
		imageName.innerHTML = '';
		var imageCloseButton = document.createElement('span');
		imageCloseButton.innerHTML = 'X';
		imageCloseButton.className = 't-ml-5 t-pr-2 t-pl-2 t-mt-2 t-mr-2 t-hover t-pointer dark';
		imageCloseButton.addEventListener('click', function (e) {
			imageName.innerHTML = '';
			document.getElementById('imageNameContainer').classList.toggle('t-hidden');
			document.getElementById('realUploadButton').value = null;
			XFZ.status.input.hasImage = false;
			XFZ.status.input.image = null;
		});
		imageNameContainer.appendChild(imageName);
		imageNameContainer.appendChild(imageCloseButton);
		uploadContainer.appendChild(imageNameContainer);

		var realUploadButton = document.createElement('input');
		realUploadButton.type = 'file';
		realUploadButton.classList.add('t-hidden');
		realUploadButton.id = 'realUploadButton';
		realUploadButton.addEventListener('change', function (e) {
			console.log('changed');
			var image = e.target.files[0];
			if (image) {
				document.getElementById('imageName').innerHTML = image.name;
				var imageNameContainer = document.getElementById('imageNameContainer');
				if (imageNameContainer.classList.contains('t-hidden')) {
					imageNameContainer.classList.toggle('t-hidden');
				}
				console.log(image);
				XFZ.status.input.image = image.path;
				XFZ.status.input.hasImage = true;
			}
		})
		uploadContainer.appendChild(realUploadButton);

		var inputBox = document.createElement('div');
		inputBox.classList.add('t-input');
		inputBox.appendChild(textarea);
		inputBox.appendChild(uploadContainer);

		window.addEventListener('keyup', function (event) {
			var inputTextarea = document.getElementById('inputTextarea');
			var parameter = {}
			if (event.key === 'Enter' && event.ctrlKey) {
				if (inputTextarea.value !== '') {
					parameter.text = inputTextarea.value;
					inputTextarea.value = '';
					if (XFZ.status.input.isReply) {
						var array = parameter.text.split(' ');
						var stillReplying = false;
						for (var i = array.length - 1; i >= 0; i--) {
							if (array[i] === '@' + XFZ.status.input.replyToUsername) {
								stillReplying = true;
								break;
							}
						}
						if (stillReplying) {
							parameter.isReply = true;
							parameter.replyToId = XFZ.status.input.replyToId;
							parameter.replyToUser = XFZ.status.input.replyToUser;
						}
					} else if (XFZ.status.input.isRepost) {
						parameter.isRepost = true;
						parameter.repostToId = XFZ.status.input.repostToId;
					} else if (XFZ.status.input.hasImage) {
						parameter.hasImage = true;
						parameter.image = XFZ.status.input.image;
						console.log(parameter.image);
					}
					action.postStatus(parameter, function(data){
						// TODO: add success alert
						XFZ.setAlert('success', 'post');
						XFZ.checkNewTimeline();
						inputTextarea.value = '';
						XFZ.resetInput(true);
					});
				}
			}
		});
		/*
			logoutBt.addEventListener('click', function(e){
					var target = e.target;
					XFZ.status.page = 'logout';
					XFZ.renderPage();
				}, false);
			console.log('here')
			postBt.addEventListener('click', function(e){
				var target = e.target;
				var inputArea = document.getElementById('inputArea');
				var parameter = {};
				var textArray = inputArea.value.split(' ');
				var char;
				for(var i = 0; i < textArray.length; i++){
					char = textArray[i].split('');
					if(char[0] === '@'){
						console.log('textArray :' + textArray[i]);
						console.log('inputArea.dataset :');
						console.log(inputArea.dataset);
						if(textArray[i] === '@' + inputArea.dataset.replyToName){
							parameter = inputArea.dataset;
							parameter.isReply = true;
						}
					}
				}
				parameter.text = inputArea.value;
				console.log(parameter);

				XFZ.Post('/action/postStatus', parameter, function(data){
					document.getElementById('inputArea').value = 'sent';
				});
			}, false);
		*/
		XFZ.appendChilds(inputContainer, [avatarContainer, inputBox]);

		return inputContainer;
	},
	/*
	 *Setup the timeline
	 */
	renderTimeline : function(data, hidden){
		var timelineStream = document.getElementById('timelineStream');
		timelineStream.classList.add('t-timeline-stream');

		//for each data create a message block
		var message, messageContainer;
		var leftCell, userAvatarLink, userAvatar, username;
		var middleCell, middleTop, content, contentContainer, photo;
		var rightCell, rightTop, rightMiddle, rightBottom;
		var reply, destroy;
		for(var i = 0; i < data.length; i++){
			message = data[i];
			
			// A contianer for each message
			messageContainer = document.createElement('li');
			messageContainer.classList.add('t-message-container');
			messageContainer.id = message.id;
			
			// Left cell
			leftCell = document.createElement('div');
			userAvatarLink = document.createElement('a');
			userAvatar = document.createElement('img');
			userAvatar.classList.add('t-avatar')
			userAvatar.src = message.user.profile_image_url;
			userAvatarLink.appendChild(userAvatar);
			leftCell.appendChild(userAvatarLink);
			
			messageContainer.appendChild(leftCell);

			// Middle cell
			middleCell = document.createElement('div');
			middleCell.classList.add('t-middle-cell');
			middleTop = document.createElement('a');
			username = document.createElement('span');
			username.classList.add('t-username');
			username.innerHTML = message.user.name;
			middleTop.appendChild(username);
			middleCell.appendChild(middleTop);

			contentContainer = document.createElement('div');
			contentContainer.classList.add('t-middle-bottom-cell');
			content = document.createElement('span');
			contentContainer.appendChild(content);
			if (message.photo) {
				var photoContainer = document.createElement('a');
				var photo = new Image();
				content.classList.add('t-content-with-photo');
				photoContainer.classList.add('t-content-photo-container');
				photo.src = message.photo.thumburl;
				photo.dataset.largeurl = message.photo.largeurl;
				photoContainer.appendChild(photo);
				content.appendChild(photoContainer);
			} else {
				content.classList.add('t-content');
			}
			content.innerHTML += message.text;
			middleCell.appendChild(contentContainer);
			messageContainer.appendChild(middleCell);
			
			// Right cell
			rightCell = document.createElement('div');
			rightCell.classList.add('t-right-cell');
			
			rightTop = document.createElement('div');
			rightTop.classList.add('t-right-child-cell');
			rightCell.appendChild(rightTop);

			rightMiddle = document.createElement('div');
			rightMiddle.classList.add('t-right-child-cell');
			rightCell.appendChild(rightMiddle);
			var repost = document.createElement('input');
			rightMiddle.appendChild(repost);
			repost.classList.add('t-right-button');
			repost.type = 'button';
			repost.value = '转发';
			repost.dataset.id = message.id;
			repost.onclick = function (e) {
				var inputArea = document.getElementById('inputTextarea');
				var atUserList = [];
				var char;
				var item = XFZ.status.timeline.cache[e.target.dataset.id];
				inputArea.focus();
				inputArea.value = '转@' + item.user.name + ' ' + item.text;
				inputArea.setSelectionRange(0, 0);
				XFZ.setInputData('repost', item);
			}
			
			rightBottom = document.createElement('div');
			rightBottom.classList.add('t-right-child-cell');
			rightCell.appendChild(rightBottom);

			messageContainer.appendChild(rightCell);

			if(!message.is_self || message.is_self === 'false'){
				reply = document.createElement('input');
				rightTop.appendChild(reply);
				reply.type = 'button'
				reply.value = '回复';
				reply.classList.add('t-right-button');
				reply.dataset.id = message.id;
				reply.addEventListener('click', function(e){
					var inputArea = document.getElementById('inputTextarea');
					var atUserList = [];
					var char;
					var item = XFZ.status.timeline.cache[e.target.dataset.id];
					inputArea.focus();
					//找到原消息中所有被@的用户
					inputArea.value = '@' + item.user.name + ' ';
					XFZ.setInputData('reply', item);
				}, false);
			}
			else{
				destroy = document.createElement('input');
				rightTop.appendChild(destroy);
				//当发布信息的用户是自己的话,回复键改为删除键
				destroy.type = 'button'
				destroy.value = '删除';
				destroy.classList.add('t-right-button');
				destroy.dataset.id = message.id;
				destroy.addEventListener('click', function(e){
					action.destroyStatus({msgId : e.target.dataset.id}, function(data){
						console.log(data);
						if(data.success){
							XFZ.setAlert('success', 'delete')
							// If the message is the first message, replace the first id with the one at second place
							if(XFZ.status.timeline.first === e.target.dataset.id){
								XFZ.status.timeline.data.shift();
								XFZ.status.timeline.first = XFZ.status.timeline.data[0].id;
							}
							// remove data form cache
							XFZ.status.timeline.cache[e.target.dataset.id] = null;
							e.target.parentElement.parentElement.parentElement.outerHTML = '';
						}
					});
				}, false);
			}
			if(hidden){
				timelineStream.insertBefore(messageContainer, timelineStream.firstChild);
			} else {
				timelineStream.appendChild(messageContainer);
				XFZ.status.timeline.last = messageContainer.id;
			}
			if(messageContainer === timelineStream.firstChild){
				XFZ.status.timeline.first = messageContainer.id;
			}
		}
	},
	renderBody : function(){
		switch(XFZ.status.nav){
			case 'timeline' : 
				XFZ.body.timeline();
				break;
			case 'mention' :
				XFZ.body.mention();
				break;
			case 'message' :
				XFZ.body.message();
				break;
			case 'favorite' :
				XFZ.body.favorite();
				break;
		}
	},
	setInputData: function (type, item) {
		if (type === 'reply') {
			XFZ.status.input.isReply = true;
			XFZ.status.input.replyToId = item.id;
			XFZ.status.input.replyToUser = item.user.id;
			XFZ.status.input.replyToUsername = item.user.name;
		} else if (type === 'repost') {
			XFZ.status.input.isRepost = true;
			if (item.repost_status_id) {
				XFZ.status.input.repostToId = item.repost_status_id;
			} else {
				XFZ.status.input.repostToId = item.id;
			}
		}
	},
	/*
	* get new timeline based on the last message id
	*/
	checkNewTimeline : function(){
		var firstId = XFZ.status.timeline.first;
		action.checkNewTimeline({firstId: firstId}, function(data){
			if(data.success){
				if(data.data.length > 0){
					// store the new data into unread array
					for (var i = data.data.length - 1; i >= 0; i--) {
						XFZ.status.timeline.unread.unshift(data.data[i]);
						XFZ.status.timeline.unreadCount++;
						XFZ.status.timeline.first = XFZ.status.timeline.unread[0].id;
					}
					
					var notification = document.getElementById('timelineNotification');
					// if the notification already here, plus new number to it
					var result = XFZ.setCacheData(data.data, XFZ.status.timeline.cache, XFZ.status.timeline.data, true);
					XFZ.setTimelineDataAndCache(XFZ.status.timeline, result.data, result.cache);

					if(notification.innerHTML !== ''){
						notification.firstChild.innerHTML = XFZ.status.timeline.unreadCount;
					}
					else{
						var button = document.createElement('button');
						var buttonStyle = {
							width : '100%',
							height : '20px',
							textAlign : 'center'
						}
						button.innerHTML = data.data.length;
						XFZ.setStyle(button, buttonStyle);
						notification.appendChild(button);
						button.addEventListener('click', function(e){
							var timelineData = XFZ.status.timeline;
							XFZ.renderTimeline(timelineData.unread, true);
							XFZ.status.timeline.unread = [];
							XFZ.status.timeline.unreadCount = 0;
							document.getElementById('timelineNotification').innerHTML = '';
						}, false);
					}
				}
			}
		});
	},
	body : {
		timeline : function(){
			document.getElementById('bodyContainer').innerHTML = '载入中..';
			if(XFZ.status.notMain){
				bodyContainer.innerHTML = 'Under construction';
			}
			else{
				var timeline = document.createElement('div');
				timeline.id = 'timeline';
				timeline.classList.add('t-timeline-container')

				// The notification area
				var timelineNotification = document.createElement('div');
				timelineNotification.id = 'timelineNotification';

				// The main timeline container. Contains message container
				var timelineStream = document.createElement('ol');
				timelineStream.id = 'timelineStream';

				XFZ.appendChilds(timeline, [timelineNotification, timelineStream]);
				action.getCurrUserHomeTimeline(function(data){
					if(!data.data){
						var li = document.createElement('li');
						li.style.listStyleType = 'none';
						li.innerHTML = '没有信息哦.';
						document.getElementById('ol').appendChild(li);
					}
					else{
						var result = XFZ.setCacheData(data.data, XFZ.status.timeline.cache, XFZ.status.timeline.data, true);
						XFZ.setTimelineDataAndCache(XFZ.status.timeline, result.data, result.cache);
						bodyContainer.innerHTML = '';
						bodyContainer.appendChild(timeline);
						XFZ.status.timeline.data = data.data;
						XFZ.renderTimeline(data.data);
						if(data.data.length >= 10){
							/* When use scroll mouse to the last 30% of the page,
							 * request more message based on the last id. */
							timeline.addEventListener('scroll', function(e){
								var target = e.target;
								var top = target.scrollTop;
								var height = target.scrollHeight;
								var currHeight = target.clientHeight;
								var gap = top / (height - currHeight) * 100;
								if(gap >= 70 && !XFZ.status.loadingContent){
									XFZ.status.loadingContent = true;
									var lastId = XFZ.status.timeline.last;
									var loadingLi = document.createElement('li');
									loadingLi.innerHTML = '载入中..';
									document.getElementById('timelineStream').appendChild(loadingLi);
									action.getHomeTimelineBeforeLast({contentId: lastId}, function(data){
										var parent = document.getElementById('timelineStream');
										if(data.success){
											var result = XFZ.setCacheData(data.data, XFZ.status.timeline.cache, XFZ.status.timeline.data, false);
											XFZ.setTimelineDataAndCache(XFZ.status.timeline, result.data, result.cache);
											parent.removeChild(parent.lastChild);
											XFZ.renderTimeline(data.data);
											XFZ.status.loadingContent = false;
										}
									});
								}
							}, false);
						}
						setInterval(function(){
							XFZ.checkNewTimeline();
						}, 10 * 1000);
					}
				});
			}
		}
	},
	setStyle : function(id, styles){
		for(var style in styles){
			id.style[style] = styles[style];
		}
	},
	appendChilds : function(parent, array){
		for(var id in array){
			parent.appendChild(array[id]);
		}
	},
	page : {
		welcome : function(){
			if (action.checkToken().success) {
				XFZ.status.page = 'main';
				XFZ.renderPage();
			} else {
				var div = document.createElement('div');
				var loginLink = document.createElement('input');
				loginLink.type = 'button';
				loginLink.value = '登录';
				loginLink.addEventListener('click', function () {
					action.authorize(function(data){
						XFZ.status.page = 'main';
						XFZ.renderPage();
					});
				})
				div.appendChild(loginLink);
				container.appendChild(div);
			}
		},
		logout : function(){
			action.logout(function(data){
				if(data.success){
					container.innerHTML = '登出成功!';
					setTimeout(function () {
						XFZ.status.page = 'welcome';
						XFZ.renderPage();
					}, 3000);
				}
			});
		},
		main : function(){
			var div = document.createElement('div');

			var navBarContainer = document.createElement('div');
			navBarContainer.id = 'navBarContainer';
			var timelineBar = document.createElement('div');
			timelineBar.id = 'timelineBar';
			var navBarContainerStyle = {
				borderWidth : '1px',
				height : '20px',
				width : '350px'
			}
			XFZ.setStyle(navBarContainer, navBarContainerStyle);
			timelineBar.innerHTML = 'Timeline';
			var timelineBarStyle = {
				display: 'inline-block',
				width : '80px',
				paddingLeft : '10px',
				paddingRight : '10px',
				borderBottom : '5px'
			}
			XFZ.setStyle(timelineBar, timelineBarStyle);
			navBarContainer.appendChild(timelineBar);

			var bodyContainer = document.createElement('div');
			bodyContainer.id = 'bodyContainer';
			var timeline = document.createElement('div');
			
			action.getCurrUser(function(data){
				if(data.success){
					var inputContainer = XFZ.renderInput();
					XFZ.status.currUser = data.data;
					container.innerHTML = '';
					XFZ.appendChilds(div, [inputContainer, navBarContainer, bodyContainer]);
					container.appendChild(div);

					document.getElementById('currUserAvatar').src = XFZ.status.currUser.profile_image_url;
					XFZ.status.nav = 'timeline';
					XFZ.status.notCurrUser = false;
					XFZ.renderBody();
				}
			});
		},
	},
	setTimelineDataAndCache: function (timeline, data, cache) {
		timeline.data = data.slice();
		timeline.cache = JSON.parse(JSON.stringify(cache));
	},
	setCacheData: function (data, cache, items, fresh) {
		var finalCache = cache ? JSON.parse(JSON.stringify(cache)) : {};
		var finalData = items ? items.slice() : [];
		var mode = fresh || true;
		for (var i = data.length - 1; i >= 0; i--) {
			if (fresh) {
				finalData.unshift(data[i]);
			} else {
				finalData.push(data[i]);
			}
			// TODO: This may cause memory issue
			finalCache[data[i].id] = data[i];
		}
		return {
			data: finalData,
			cache: finalCache
		};
	},
	setAlert: function (option, type) {
		var option = '';
		var text = '';
		var lib = {
			post: '发布',
			delete: '删除',
			favorite: '收藏',
			unfavorite: '取消收藏'
		}
		text = lib[type];

		if (option === 'success') {
			text += '成功';
		} else {
			text += '错误'
		}

		if (text === '错误') {
			text = '村长在用服务器下片，请稍后再试。';
		}
		document.getElementById('alert').className = 't-alert-open ' + option;
		document.getElementById('alertText').textContent = text;
		document.getElementById('alert').style.display = 'block';
		if (XFZ.alertTimer) {
			clearTimeout(XFZ.alertTimer);
		}
		XFZ.alertTimer = setTimeout(function () {
			document.getElementById('alert').classList.remove('t-alert-open');
			document.getElementById('alert').classList.add('t-alert-close');
		}, 3000);
	},
	resetInput: function (full) {
		XFZ.status.input.isReply = false;
		XFZ.status.input.replyToId = '';
		XFZ.status.input.replyToUser = '';
		XFZ.status.input.replyToUsername = '';
		XFZ.status.input.isRepost = false;
		XFZ.status.input.repostToId = '';
		if (full) {
			XFZ.status.input.hasImage = false;
			XFZ.status.input.image = null;
		}
	}
};
XFZ.init();
			