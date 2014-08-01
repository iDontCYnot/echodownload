captureRequest = (info) ->
	url = info.url.toString()
	console.log "Capturing #{url}"
	#search = request_url?.search "loadDetailsSuccess"\
	if url.search("loadDetailsSuccess") isnt -1
		[url, ...] = url.match /.+details.json/i
		if url?
			console.log "Alright! lets go! #{info.tabId}"
			chrome.tabs.sendMessage info.tabId, url: url, (successful) =>
				if successful
					console.log "Showing action on tab:#{info.tabId}"
					chrome.pageAction.show info.tabId
				else
					console.log "Hiding action on tab:#{info.tabId}"
					chrome.pageAction.hide info.tabId

chrome.webRequest.onCompleted.addListener captureRequest, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
