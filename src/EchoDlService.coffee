class window.EchoDlService

	@_sendMessage: (tabId, url) ->
		console.log "Alright, lets go #{tabId}!"
		console.log url
		info =
			tabId: tabId
			url: url
		#send internal message
		BrowserComms.sendToContent tabId, info

	@processRequest: (tabId, url) ->
		if url.search("loadDetailsSuccess") isnt -1
			[url, ...] = url.match /.+details.json/i
			if url?
				@_sendMessage tabId, url
