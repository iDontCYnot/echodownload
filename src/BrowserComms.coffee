# Provides interface between various browsers and EchoDL and EchoDlService
class window.BrowserComms

	# Content script receiving from background
	@fromBackground: if chrome?.runtime #google chrome
			(request, sender, callback) ->
				EchoDl.processRequest request.url, request.tabId
		else if safari?.self #apple safari
			(msgEvent) ->
				EchoDl.processRequest msgEvent.message.url, msgEvent.message.tabId

	# Content script sending to background
	@sendToBackground: (message) ->
		chrome?.runtime.sendMessage message #google chrome
		safari?.self.tab.dispatchMessage "message", message #apple safari

	# Background script receiving from content
	@fromContent: if chrome?.runtime #google chrome
			(request, sender, callback) =>
				@_onResult request.tabId, request.result
		else if safari?.application #apple safari
			(msgEvent) =>
				@_onResult msgEvent.message.tabId, msgEvent.message.result

	# Background script sending to content
	@sendToContent: (tabId, info) ->
		chrome?.tabs.sendMessage tabId, info #chrome
		safari?.self.tabs[tabId].page.dispatchMessage "message", info #safari

	# Background request capture
	@onCompletedRequest:
		if chrome?.webRequest #google chrome
			(info) ->
				EchoDlService.processRequest info.tabId, (info.url.toString())

	# Background receiving result from content
	@_onResult: (tabId, result) ->
		if result #show action
			console.log "Showing action on tab:#{tabId}"
			chrome?.pageAction.show tabId #chrome
		else #hide action
			console.log "Hiding action on tab:#{tabId}"
			chrome?.pageAction.hide tabId #chrome

	@getLocaleString: (messageName) ->
		chrome?.i18n.getMessage messageName
