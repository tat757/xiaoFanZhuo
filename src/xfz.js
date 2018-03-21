var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var XFZ = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		},
		input: {
			isReply: true,
			replyToId: '',
			replyToUser: '',
			replyToUsername: '',
			isRepost: true,
			repostToId: ''
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
		nav : 'home',
		notMain : false,
		loadingContent : false
	},
	init : function(){
		document.body.style.overflowY = 'hidden';
		XFZ.status.page = 'welcome';
		XFZ.renderPage();
	},
	Get : function(url, callback){
		httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				if(callback){
					callback(JSON.parse(this.responseText));
				}
			}
		};
		httpRequest.open('GET', url, true);
		httpRequest.send();
	},
	Post : function(url, data, callback){
		httpRequest = new XMLHttpRequest();
		httpRequest.open('POST', url, true);
		data = JSON.stringify(data);
		httpRequest.setRequestHeader('Content-type', 'application/json');

		httpRequest.onreadystatechange = function(){
			if(this.readyState == 4 && this.status == 200){
				if(callback){
					callback(JSON.parse(this.responseText));
				}
			}
		};
		httpRequest.send(data);
	},
	renderPage : function(){
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
		logoutButton.value = 'x'; // TODO: replace with power image
		logoutButton.classList.add('t-logout-button');
		logoutButton.onclick = function (e) {
			var target = e.target;
			XFZ.status.page = 'logout';
			XFZ.renderPage();
		};

		var featureBlock = document.createElement('div');
		featureBlock.id = 'featureBlock';
		featureBlock.classList.add('t-feature-block');
		featureBlock.appendChild(logoutButton);

		var avatarContainer = document.createElement('div');
		avatarContainer.classList.add('t-avatar-container');
		avatarContainer.appendChild(avatarBlock);
		avatarContainer.appendChild(featureBlock);

		var textarea = document.createElement('textarea');
		textarea.id = 'inputTextarea';
		textarea.classList.add('t-input-textarea');

		var inputBox = document.createElement('div');
		inputBox.classList.add('t-input');
		inputBox.appendChild(textarea);

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
					}
					XFZ.Post('/action/postStatus', parameter, function(data){
						inputTextarea.value = '';
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
		console.log(data);
		var timelineStream = document.getElementById('timelineStream');
		timelineStream.classList.add('t-timeline-stream');

		//for each data create a message block
		var message, messageContainer;
		var leftCell, userAvatarLink, userAvatar;
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
				content.classList.add('t-content-with-photo');
				var photoContainer = document.createElement('a');
				photoContainer.classList.add('t-content-photo-container');
				var photo = new Image();
				photo.src = message.photo.thumburl;
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
				destroy.id = message.id;
				destroy.classList.add('t-right-button');
				destroy.addEventListener('click', function(e){
					XFZ.Post('/action/destroyStatus', {msgId : e.target.dataset.id}, function(data){
						if(data.success){
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
				timelineStream.insertBefore(messageContainer, document.getElementById(XFZ.status.timeline.first));
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
		var notification;
		XFZ.Post('/action/checkNewTimeline', {firstId: firstId}, function(data){
			if(data.success){
				if(data.data.length > 0){
					// store the new data into unread array
					for (var i = data.data.length - 1; i >= 0; i--) {
						XFZ.status.timeline.unread.unshift(data.data[i]);
						XFZ.status.timeline.unreadCount++;
					}
					notification = document.getElementById('timelineNotification');
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
				var alert = document.createElement('div');
				alert.id = 'alert';
				alert.classList.add('t-alert');

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
				XFZ.Get('/action/getCurrUserHomeTimeline', function(data){
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
									XFZ.Post('/action/getHomeTimelineBeforeLast', {contentId: lastId}, function(data){
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
		for(style in styles){
			id.style[style] = styles[style];
		}
	},
	appendChilds : function(parent, array){
		for(id in array){
			parent.appendChild(array[id]);
		}
	},
	page : {
		welcome : function(){
			container.innerHTML = '请稍候..';
			var containerStyle = {
				overflow : 'hidden'
			}
			XFZ.setStyle(container, containerStyle);
			XFZ.Get('/action/authorize', function(data){
				if(!data.success){
					window.location = data.url;
				}
				else{
					XFZ.status.page = 'main';
					XFZ.renderPage();
				}
			});
		},
		logout : function(){
			container.innerHTML = '载入中..';
			var div = document.createElement('div');
			XFZ.Get('/action/logout', function(data){
				if(data.success){
					container.innerHTML = '登出成功!';
				}
			});
		},
		main : function(){
			container.innerHTML = '加载中..';
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
			
			XFZ.Get('/action/getCurrUser', function(data){
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
	}
};
XFZ.init();
			