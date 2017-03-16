var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var xfz = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		},
		nav : 'home'
	},
	init : function(){
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
			paddingLeft : '5px',
			paddingRight : '5px',
			resize : 'none',
			display : 'inline-block'
		};
		xfz.setStyle(inputArea, inputAreaStyle);
		var inputContainerStyle = {
			paddingLeft : '5px',
			paddingRight : '5px',
			paddingBotton : '0px'
		};
		xfz.setStyle(inputContainer, inputContainerStyle);
		var postBtStyle = {
			float : 'right',
			paddingRight : '5px',
			marginTop: '-5px'
		};
		xfz.setStyle(postBt, postBtStyle);
		var currUserAvatarStyle = {
			width : '32px',
			paddingRight : '4px',
			paddingLeft : '4px',
			paddingBottom : '6px',
			display : 'inline-block'
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
			var timeline = document.createElement('div');
			

			xfz.Get('/action/getCurrUser', function(data){
				console.log(data);
				if(data.success){
					var inputContainer = xfz.setInput();
					console.log(inputContainer);
					xfz.status.currUser = data.data;
					container.innerHTML = '';
					xfz.Get('/action/getCurrAvatar', function(img){
						console.log(img);
						document.getElementById('currUserAvatar').src = 'data:image/jpeg;base64,' + img.data.image;
					});
					xfz.Get('/action/getCurrUserHomeTimeline', function(userStatuses){

					});
					xfz.appendChilds(div, [inputContainer, navBarContainer]);
					container.appendChild(div);
					console.log(document.getElementById('currUserAvatar'));
				}
			});

		},
	}
};

xfz.init();
			