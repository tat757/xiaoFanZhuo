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
			var inputArea = document.createElement('input');
			var postBt = document.createElement('button');
			var logoutBt = document.createElement('button');
			xfz.appendChilds(div, [inputArea, postBt, logoutBt]);
			container.appendChild(div);
		},
	}
};

xfz.init();
			