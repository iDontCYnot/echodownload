chrome.webRequest.onComplete.addListener requestCapture, urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]

requestCapture (info) ->
	if info.url.toStrong.search 'loadDetailsSuccess' > -1
		[url_string, ...] = info.url.toString().match /.+details.json/i
		if url_string?
			chrome.tabs.sendMessage info.tabId, url: url_string, (success) ->
				if success
					chrome.pageAction.show info.tabId
				else
					chrome.pageAction.hide info.tabId
