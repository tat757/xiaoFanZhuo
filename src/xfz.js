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
		httpRequest = new XMLHttpRequest();
		httpRequest.open('POST', url, true);
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		http.onreadystatechange = function(){
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

		xfz.appendChilds(inputContainer, [currUserAvatar, inputArea, postBt, logoutBt]);

		return inputContainer;
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
				timelineStream.appendChild(ol);

				xfz.appendChilds(timeline, [timelineNotification, timelineStream]);
				xfz.Get('/action/getCurrUserHomeTimeline', function(data){
					if(!data.data){
						var li = document.createElement('li');
						li.style.listStyleType = 'none';
						li.innerHTML = '没有信息哦.';
						ol.appendChild(li);
					}
					else{
						bodyContainer.innerHTML = '';
						bodyContainer.appendChild(timeline);
						for(count in data.data){
							var status = data.data[count];
							console.log('status');
							console.log(status);
							var li = document.createElement('li');
							var liStyle = {
								width : '320px',
								minHeight : '60px',
								listStyleType : 'none'
							};
							xfz.setStyle(li, liStyle);
							var userAvatarCell = document.createElement('a');
							var userAvatarCellStyle = {
								display : 'inline-block',
								width : '12%',
								height : '32px',
								float : 'left',
								marginLeft : '-35px'
							};
							xfz.setStyle(userAvatarCell, userAvatarCellStyle);
							var userAvatar = document.createElement('img');
							var userAvatarStyle = {
								width: '32px',
								height : '32px',
								fontSize: '12px',
							};
							xfz.setStyle(userAvatar, userAvatarStyle);
							userAvatar.src = status.user.profile_image_url;
							userAvatarCell.appendChild(userAvatar);
							var content = document.createElement('div');
							var contentStyle = {
								width: '83%',
								display : 'inline-block'
							}
							xfz.setStyle(content, contentStyle);
							var contentTop = document.createElement('a');
							contentTop.innerHTML = status.user.name;
							var contentTopStyle = {
								display: 'block',
								fontSize : '13px',
							}
							xfz.setStyle(contentTop, contentTopStyle);
							var contentBottom = document.createElement('span');
							var contentBottomStyle = {
								display: 'block',
								fontSize: '12px',
							}
							xfz.setStyle(contentBottom, contentBottomStyle);
							contentBottom.innerHTML = status.text;
							xfz.appendChilds(content, [contentTop, contentBottom]);
							var controlPanel = document.createElement('span');
							var controlPanelStyle = {
								display: 'inline-block',
								width: '5%',
								height: '60px',
								float: 'right',
								marginRight : '20px'
							}
							var reply = document.createElement('a');
							reply.innerHTML = 'R';
							var replyStyle = {
								position : 'absolute',
								zIndex : '1',
								right : '5px'
							}
							controlPanel.appendChild(reply);
							xfz.setStyle(controlPanel, controlPanelStyle);
							xfz.appendChilds(li, [userAvatarCell, content, controlPanel]);
							var hr = document.createElement('hr');
							var hrStyle = {
								width : '360px',
								marginLeft : '-40px',
							}
							xfz.setStyle(hr, hrStyle);
							li.appendChild(hr);
							ol.appendChild(li);
						}
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
				xfz.status.page = 'main';
				xfz.setPage();
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
				console.log(data);
				if(data.success){
					var inputContainer = xfz.setInput();
					console.log(inputContainer);
					xfz.status.currUser = data.data;
					container.innerHTML = '';
					xfz.appendChilds(div, [inputContainer, navBarContainer, bodyContainer]);
					container.appendChild(div);
					xfz.Get('/action/getCurrAvatar', function(img){
						console.log(img);
						document.getElementById('currUserAvatar').src = 'data:image/jpeg;base64,' + img.data.image;
					});
					xfz.status.nav = 'timeline';
					xfz.status.notCurrUser = false;
					xfz.setBody();
					console.log(document.getElementById('currUserAvatar'));
				}
			});

		},
	}
};

xfz.init();
			