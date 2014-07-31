captureRequest = (info) ->
	request_url = info.url.toString()
	console.log "searching"
	callback_fn = (_tabId) ->
		(successful) ->
			if successful
					chrome.pageAction.show _tabId
				else
					chrome.pageAction.hide _tabId
	#search = request_url?.search "loadDetailsSuccess"
	if request_url.search("loadDetailsSuccess")  isnt -1
		console.log "we have a match"
		[url_string, ...] = request_url.match /.+details.json/i
		console.log "tried to do a matching"
		if url_string?
			console.log "Alright! lets go! #{info.tabId}"
			chrome.tabs.sendMessage info.tabId, url: url_string, callback_fn info.tabId

chrome.webRequest.onCompleted.addListener captureRequest, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
