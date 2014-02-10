//listen for completed XHR
chrome.webRequest.onCompleted.addListener(function(info) {
	//check that request was for lecture meta
  	if(info.url.toString().search('loadDetailsSuccess') > -1){
  		chrome.pageAction.show(info.tabId)
		//extract the uuid from the request url
		var urlString = info.url.toString().match( /.+details.json/i )[0];
		console.log(urlString);
		if(urlString == null) return;
		//inform the content script and send uuid
	  	chrome.tabs.sendMessage(info.tabId, {url: urlString}, null);  
  }
},
{ urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"] });