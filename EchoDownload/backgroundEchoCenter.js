//listen for completed XHR request
chrome.webRequest.onCompleted.addListener(function(info) {
	//check that request was for lecture meta
	//console.log(info);
  if(info.url.toString().search('loadDetailsSuccess') > -1){
	  //extract the uuid from the request url
  	  //console.log("RequestDidComplete");
	  var urlString = info.url.toString();
	  
	  //find range of uuid
	  var leadingString = "/presentations/";
	  var trailingString = "/details.json";
	  var uuidRangeStart = urlString.search(leadingString) + leadingString.length;
	  var uuidRangeEnd = urlString.search(trailingString);
	  
	  //sanity checks
	  if(uuidRangeStart < 0 || uuidRangeEnd < 0 || uuidRangeEnd <= uuidRangeStart){
		  //malformed url terminate here
		  return;
	  }
	  
	  //clip uuid from url string
	  var uuid = urlString.substring(uuidRangeStart, uuidRangeEnd);
	  //console.log(uuid);
	  //console.log(info.tabId);
	  //inform the content script and send uuid
  	  chrome.tabs.sendMessage(info.tabId, {uuid: uuid}, function(message){
		 //console.log(message);
  	  });  
  }
},
{ urls: ['http://prod.lcs.uwa.edu.au/ecp/api/*'] });