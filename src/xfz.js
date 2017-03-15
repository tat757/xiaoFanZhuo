var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var xfz = {
	status : {
		page : 'welcome',
		currUser : {
			unique_id : ''
		}
	},
	init : function(){
		xfz.status.page = 'welcome';
		xfz.setPage();
	},
	Get : function(url, callback){
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
			case 'timeline' :
				xfz.page.timeline();
				break;
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
			xfz.Get('/action/authorize', function(data){
				xfz.status.page = 'timeline';
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
		timeline : function(){
			container.innerHTML = '加载中..';
			var div = document.createElement('div');
			var inputContainer = document.createElement('div');
			var inputArea = document.createElement('textarea');
			var postBt = document.createElement('button');
			var logoutBt = document.createElement('button');
			var currUserAvatar = document.createElement('img');
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

			xfz.appendChilds(inputContainer, [currUserAvatar, inputArea, postBt, logoutBt]);
			xfz.appendChilds(div, [inputContainer]);
			postBt.innerHTML = '发布';
			logoutBt.innerHTML = '注销';

			logoutBt.addEventListener('click', function(e){
					var target = e.target;
					xfz.status.page = 'logout';
					xfz.setPage();
				}, false);

			xfz.Get('/action/getCurrUser', function(data){
				if(data.success){
					xfz.status.currUser = data.data;
					xfz.Get('/action/getCurrAvatar', function(data){
						currUserAvatar.src = 'data:image/jpeg;base64,' + data.data.image;
						container.innerHTML = '';
						container.appendChild(div);
					});
				}
			});

		},
	}
};

xfz.init();
			