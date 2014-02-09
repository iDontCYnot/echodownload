//listen for completed XHR request
chrome.webRequest.onCompleted.addListener(function(info) {
	//check that request was for lecture meta
	//console.log(info);
  if(info.url.toString().search('loadDetailsSuccess') > -1){
	  //extract the uuid from the request url
  	  //console.log("RequestDidComplete");
	  var urlString = info.url.toString().split('?')[0];
	  if(!urlString) return;
	  //inform the content script and send uuid
  	  chrome.tabs.sendMessage(info.tabId, {url: urlString}, function(message){
		 //console.log(message);
  	  });  
  }
},
{ urls: ["http://*/ecp/api/*", "http://*/ess/client/api/*"] });