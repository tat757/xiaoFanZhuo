var container = document.getElementById('container');
var httpRequest = new XMLHttpRequest();
var xfz = {
	status : {
		page : 'welcome'
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
	setPage : function(){
		console.log('xfz.status.page: ' + xfz.status.page);
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
				console.log('switch');
				xfz.page.timeline();
				break;
		}
	},
	setStyle : function(id, styles){
		for(style in styles){
			console.log('id: ' + id);
			console.log('styles: ');
			console.log(styles);
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
				if(data.success){
					xfz.status.page = 'timeline';
					xfz.setPage();
				}
			});
		},
		timeline : function(){
			container.innerHTML = '';
			var div = document.createElement('div');
			var inputContainer = document.createElement('div');
			var inputArea = document.createElement('textarea');
			var postBt = document.createElement('button');
			var logoutBt = document.createElement('button');
			var inputAreaStyle = {
				boxSizing : 'border-box',
				width : '310px',
				paddingLeft : '5px',
				paddingright : '5px',
				marginLeft : '40px',
				resize : 'none'
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
			}
			xfz.setStyle(postBt, postBtStyle);

			xfz.appendChilds(inputContainer, [inputArea, postBt]);
			xfz.appendChilds(div, [inputContainer]);
			container.appendChild(div);
			postBt.innerHTML = '发布';
			logoutBt.innerHTML = '注销';
		},
	}
};

xfz.init();
			