//listen for completed XHR
chrome.webRequest.onCompleted.addListener(function(info) {
	//check that request was for lecture meta
  	if(info.url.toString().search('loadDetailsSuccess') > -1){
		//extract the uuid from the request url
		var urlString = info.url.toString().match( /.+details.json/i )[0];
		// TODO first match
		console.log(urlString);
		if(urlString == null) return;
		//inform the content script and send url
	  	chrome.tabs.sendMessage(info.tabId, {url: urlString}, function(){
	  		chrome.pageAction.show(info.tabId);
	  	});  
  }
},
{ urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"] });