requestCapture = (info) ->
	request_url = info.url.toString()
	num = request_url?.search "loadDetailsSuccess"
	if num isnt -1
		[url_string, ...] = request_url.match /.+details.json/i
		if url_string?
			chrome.tabs.sendMessage info.tabId, url: url_string, (success) ->
				if success
					chrome.pageAction.show info.tabId
				else
					chrome.pageAction.hide info.tabId

chrome.webRequest.onCompleted.addListener requestCapture, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
