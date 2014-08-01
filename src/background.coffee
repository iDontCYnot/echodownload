class EchoDlService

	@_sendMessage: (tabId, url) ->
		console.log "Alright! lets go! #{tabId}"
		console.log url
		info =
			tabId: tabId
			url: url
		#send internal message in chrome
		chrome?.tabs?.sendMessage tabId, info

	@_showAction: (tabId) ->
		console.log "Showing action on tab:#{tabId}"
		#set action visible chrome
		chrome?.pageAction?.show tabId

	@_hideAction: (tabId) ->
		console.log "Hiding action on tab:#{tabId}"
		#set action hidden chrome
		chrome?.pageAction?.hide tabId

	@_onResult: (tabId, result) ->
		if result
			@_showAction tabId
		else
			@_hideAction tabId

	@_processRequest: (tabId, url) ->
		if url.search("loadDetailsSuccess") isnt -1
			[url, ...] = url.match /.+details.json/i
			if url?
				@_sendMessage tabId, url

	@onRequest: ->
		#extract data from request
		if chrome?.webRequest? #google chrome
			(info) =>
				@_processRequest info.tabId, (info.url.toString())

	@onMessage: ->
		#parse response
		if chrome?.runtime? #google chrome
			(request, sender, callback) =>
				@_onResult request.tabId, request.result

#tell chrome what to do with the requests it hears
chrome?.runtime?.onMessage.addListener EchoDlService.onMessage()
chrome?.webRequest?.onCompleted.addListener EchoDlService.onRequest(), urls: ["*://*/ecp/api/*", "*://*/ess/client/api/*"]
