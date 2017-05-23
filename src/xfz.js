var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var xfz = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		},
		nav : 'home',
		notMain : false,
		loadingContent : false
	},
	init : function(){
		document.body.style.overflowY = 'hidden';
		xfz.status.page = 'welcome';
		xfz.setPage();
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
		console.log(data);
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
	setPage : function(){
		switch(xfz.status.page){
			case 'welcome' : 
				xfz.page.welcome();
				break;
			case 'login' :
				xfz.page.login();
				break;
			case 'logout' :
				xfz.page.logout();
				break;
			case 'main' :
				xfz.page.main();
				break;
		}
	},
	setInput : function(){
		var inputContainer = document.createElement('div');
		var inputArea = document.createElement('textarea');
		var postBt = document.createElement('button');
		var logoutBt = document.createElement('button');
		var currUserAvatar = document.createElement('img');
		inputContainer.id = 'inputContainer';
		inputArea.id = 'inputArea';
		postBt.id = 'postBt';
		logoutBt.id = 'logoutBt';
		currUserAvatar.id = 'currUserAvatar';
		var inputAreaStyle = {
			boxSizing : 'border-box',
			width : '310px',
			resize : 'none'
		};
		xfz.setStyle(inputArea, inputAreaStyle);
		var inputContainerStyle = {
			paddingLeft : '5px',
			paddingRight : '5px',
			paddingBotton : '0px',
			height : '65px'
		};
		xfz.setStyle(inputContainer, inputContainerStyle);
		var postBtStyle = {
			paddingRight : '5px',
			marginTop: '-5px'
		};
		xfz.setStyle(postBt, postBtStyle);
		var currUserAvatarStyle = {
			width : '32px',
			height : '32px',
			paddingRight : '3px',
			float : 'left'
		};
		xfz.setStyle(currUserAvatar, currUserAvatarStyle);
		postBt.innerHTML = '发布';
		logoutBt.innerHTML = '注销';

		logoutBt.addEventListener('click', function(e){
				var target = e.target;
				xfz.status.page = 'logout';
				xfz.setPage();
			}, false);

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

			xfz.Post('/action/postStatus', parameter, function(data){
				document.getElementById('inputArea').value = 'sent';
			});
		}, false);

		xfz.appendChilds(inputContainer, [currUserAvatar, inputArea, postBt, logoutBt]);

		return inputContainer;
	},
	setTimeline : function(data, hidden){
		var ol = document.getElementById('ol');
		var status, li, userAvatarCell, userAvatar, content;
		var contentTop, contentBottom, controlPanel, reply, hr;
		var liStyle = {
			width : '320px',
			minHeight : '60px',
			listStyleType : 'none'
		};
		var userAvatarCellStyle = {
			display : 'inline-block',
			width : '12%',
			height : '32px',
			float : 'left',
			marginLeft : '-35px'
		};
		var userAvatarStyle = {
			width: '32px',
			height : '32px',
			fontSize: '12px',
		};
		var contentStyle = {
			width: '83%',
			display : 'inline-block'
		};
		var contentTopStyle = {
			display: 'block',
			fontSize : '13px',
		};
		var contentBottomStyle = {
			display: 'block',
			fontSize: '12px',
		};
		var controlPanelStyle = {
			display: 'inline-block',
			width: '5%',
			height: '60px',
			float: 'right',
			marginRight : '20px'
		};
		var replyStyle = {
			position : 'absolute',
			zIndex : '1',
			right : '5px'
		};
		var hrStyle = {
			width : '360px',
			marginLeft : '-40px',
		};
		console.log(data[0]);
		console.log(data[1]);
		for(count in data){
			status = data[count];
			li = document.createElement('li');
			xfz.setStyle(li, liStyle);
			userAvatarCell = document.createElement('a');
			xfz.setStyle(userAvatarCell, userAvatarCellStyle);
			userAvatar = document.createElement('img');
			xfz.setStyle(userAvatar, userAvatarStyle);
			userAvatar.src = status.user.profile_image_url;
			userAvatarCell.appendChild(userAvatar);
			content = document.createElement('div');
			content.id = status.id;
			xfz.setStyle(content, contentStyle);
			contentTop = document.createElement('a');
			contentTop.innerHTML = status.user.name;
			xfz.setStyle(contentTop, contentTopStyle);
			contentBottom = document.createElement('span');
			xfz.setStyle(contentBottom, contentBottomStyle);
			contentBottom.innerHTML = status.text;
			xfz.appendChilds(content, [contentTop, contentBottom]);
			controlPanel = document.createElement('span');
			reply = document.createElement('a');
			reply.innerHTML = 'R';
			reply.dataset.replyToName = status.user.name;
			reply.dataset.replyToId = status.user.id;
			reply.dataset.replyId = status.id;
			reply.addEventListener('click', function(e){
				var inputArea = document.getElementById('inputArea');
				var atUserList = [];
				var char;
				inputArea.focus();
				inputArea.dataset.replyId = e.target.dataset.replyId;
				inputArea.dataset.replyToId = e.target.dataset.replyToId;
				inputArea.dataset.replyToName = e.target.dataset.replyToName;
				inputArea.dataset.isReply = true;
				var text = document.getElementById(e.target.dataset.replyId).lastChild.innerHTML;
				console.log(text);
				var textArray = text.split(' ');
				console.log(textArray);
				//找到原消息中所有被@的用户
				for(var i = 0; i < textArray.length; i++){
					char = textArray[i].split('');
					if(char[0] === '@'){
						atUserList.push(textArray[i]);
					}
				}
				inputArea.value = '@' + e.target.dataset.replyToName + ' ';
				for(var i = 0; i < atUserList.length; i++){
					inputArea.value += atUserList + ' ';
				}
			}, false);
			controlPanel.appendChild(reply);
			xfz.setStyle(controlPanel, controlPanelStyle);
			xfz.appendChilds(li, [userAvatarCell, content, controlPanel]);
			hr = document.createElement('hr');
			xfz.setStyle(hr, hrStyle);
			li.appendChild(hr);
			if(hidden){
				li.style.display = 'none';
				ol.insertBefore(li, document.getElementsByClassName('first')[0]);
				document.getElementsByClassName('first')[0].classList.remove('first');
				li.classList.add('unread');
			}
			else{
				ol.appendChild(li);
				if(count == data.length - 1){
					li.classList.add('last');
				}
			}
			if(li == ol.firstChild){
				li.classList.add('first');
			}
		}
	},
	setBody : function(){
		switch(xfz.status.nav){
			case 'timeline' : 
				xfz.body.timeline();
				break;
			case 'mention' :
				xfz.body.mention();
				break;
			case 'message' :
				xfz.body.message();
				break;
			case 'favorite' :
				xfz.body.favorite();
				break;
		}
	},
	checkNewTimeline : function(){
		var first = document.getElementsByClassName('first')[0].childNodes[1];
		var notification;
		xfz.Post('/action/checkNewTimeline', {firstId: first.id}, function(data){
			if(data.success){
				if(data.data.length > 0){
					notification = document.getElementById('timelineNotification');
					if(notification.innerHTML !== ''){
						notification.firstChild.innerHTML = data.data.length + +notification.firstChild.innerHTML;
					}
					else{
						var button = document.createElement('button');
						var buttonStyle = {
							width : '100%',
							height : '20px',
							textAlign : 'center'
						}
						button.innerHTML = data.data.length;
						xfz.setStyle(button, buttonStyle);
						notification.appendChild(button);
						button.addEventListener('click', function(e){
							var i = 0;
							var unread = document.getElementsByClassName('unread');
							document.getElementById('timelineNotification').innerHTML = '';
							for(i = 0; i <= unread.length; i++){
								unread[count].style.display = 'block';
								unread[count].classList.remove('unread');
							}
						}, false);
					}
					xfz.setTimeline(data.data, true);
				}
			}
		});
	},
	body : {
		timeline : function(){
			document.getElementById('bodyContainer').innerHTML = '载入中..';
			if(xfz.status.notMain){
				bodyContainer.innerHTML = 'Under construction';
			}
			else{
				var timeline = document.createElement('div');
				timeline.id = 'timeline';
				var timelineStyle = {
					height: '550px',
					overflowY : 'scroll'
				};
				xfz.setStyle(timeline, timelineStyle);
				var timelineNotification = document.createElement('div');
				timelineNotification.id = 'timelineNotification';
				var timelineStream = document.createElement('div');
				timelineStream.id = 'timelineStream';
				var ol = document.createElement('ol');
				ol.id = 'ol';
				timelineStream.appendChild(ol);

				xfz.appendChilds(timeline, [timelineNotification, timelineStream]);
				xfz.Get('/action/getCurrUserHomeTimeline', function(data){
					if(!data.data){
						var li = document.createElement('li');
						li.style.listStyleType = 'none';
						li.innerHTML = '没有信息哦.';
						document.getElementById('ol').appendChild(li);
					}
					else{
						bodyContainer.innerHTML = '';
						bodyContainer.appendChild(timeline);
						xfz.setTimeline(data.data);
						if(data.data.length >= 10){
							timeline.addEventListener('scroll', function(e){
								var target = e.target;
								var top = target.scrollTop;
								var height = target.scrollHeight;
								var currHeight = target.clientHeight;
								var gap = top / (height - currHeight) * 100;
								if(gap >= 70 && !xfz.status.loadingContent){
									xfz.status.loadingContent = true;
									console.log('bottom');
									var last = document.getElementsByClassName('last')[0];
									var contentId = last.firstChild.nextSibling.id;
									var loadingLi = document.createElement('li');
									loadingLi.innerHTML = '载入中..';
									last.parentNode.appendChild(loadingLi);
									xfz.Post('/action/getHomeTimelineBeforeLast', {contentId: contentId}, function(data){
										var parent = document.getElementById('ol');
										if(data.success){
											parent.removeChild(parent.lastChild);
											document.getElementsByClassName('last')[0].classList.remove('last');
											xfz.setTimeline(data.data);
											xfz.status.loadingContent = false;
										}
									});
								}
								console.log(gap);

							}, false);
						}
						setInterval(function(){
							xfz.checkNewTimeline();
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
			xfz.setStyle(container, containerStyle);
			xfz.Get('/action/authorize', function(data){
				if(!data.success){
					window.location = data.url;
				}
				else{
					xfz.status.page = 'main';
					xfz.setPage();
				}
			});
		},
		logout : function(){
			container.innerHTML = '载入中..';
			var div = document.createElement('div');
			xfz.Get('/action/logout', function(data){
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
			xfz.setStyle(navBarContainer, navBarContainerStyle);
			timelineBar.innerHTML = 'Timeline';
			var timelineBarStyle = {
				display: 'inline-block',
				width : '80px',
				paddingLeft : '10px',
				paddingRight : '10px',
				borderBottom : '5px'
			}
			xfz.setStyle(timelineBar, timelineBarStyle);
			navBarContainer.appendChild(timelineBar);

			var bodyContainer = document.createElement('div');
			bodyContainer.id = 'bodyContainer';
			var timeline = document.createElement('div');
			

			xfz.Get('/action/getCurrUser', function(data){
				if(data.success){
					var inputContainer = xfz.setInput();
					xfz.status.currUser = data.data;
					container.innerHTML = '';
					xfz.appendChilds(div, [inputContainer, navBarContainer, bodyContainer]);
					container.appendChild(div);

					console.log(xfz.status.currUser);
					document.getElementById('currUserAvatar').src = xfz.status.currUser.profile_image_url;
					xfz.status.nav = 'timeline';
					xfz.status.notCurrUser = false;
					xfz.setBody();
				}
			});

		},
	}
};

xfz.init();
			