captureRequest = (info) ->
	request_url = info.url.toString()
	#search = request_url?.search "loadDetailsSuccess"\
	if request_url.search("loadDetailsSuccess") isnt -1
		[url_string, ...] = request_url.match /.+details.json/i
		if url_string?
			console.log "Alright! lets go! #{info.tabId}"
			chrome.tabs.sendMessage info.tabId, url: url_string, (successful) ->
				if successful
					console.log "Showing action on tab:#{info.tabId}"
					chrome.pageAction.show info.tabId
				else
					console.log "Hiding action on tab:#{info.tabId}"
					chrome.pageAction.hide info.tabId

chrome.webRequest.onCompleted.addListener captureRequest, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
