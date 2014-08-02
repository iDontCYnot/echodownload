class window.EchoDl

	#used to store most recently initiated request
	#will be useful when aync activities come into play
	@_REQUEST = 0

	#check whether a request is still valid
	@_isValidRequest: (requestId) ->
		console.log "Checking #{requestId} against #{@_REQUEST}"
		requestId >= @_REQUEST

	@_sendMessage: (tabId, result) ->
		info =
			tabId: tabId
			result: result
		#send internal message in chrome
		chrome?.runtime?.sendMessage info #google chrome
		safari?.self?.tab?.dispatchMessage "message", info #apple safari

	#inteprets background pages message
	@onMessage: ->
		#pass required information to ED get+exec function
		if chrome?.runtime? #google chrome
			(request, sender, callback) =>
				@_getMetadataAndExecute request.url, request.tabId
		if safari?.self? #apple safari
			(msgEvent) =>
				@_getMetadataAndExecute msgEvent.message.url, msgEvent.message.tabId

	#loads lecture metadata and begins process of adding download links
	@_getMetadataAndExecute: (url, tabId) ->
		# closure to ensure data retention
		continuation_fn = (_reqId, _reqUrl, _tabId) =>
			(data) => if @_isValidRequest _reqId
					@_processLecture data.presentation, _reqUrl, _reqId, _tabId
		#ajax request
		$.ajax
			url: url
			success: continuation_fn ++@_REQUEST, url, tabId

	@_processLecture: (jsonData, url, requestId, tabId) ->
		console.log "Processing Lecture"
		#make a lecture and start working with it
		lecture = new Lecture jsonData, url
		if lecture.hasError()
			console.error "Lecture not valid"
			# Stop any expired callbacks
			@_sendMessage tabId, false if @_isValidRequest requestId
			return
		#grab meta element
		lectureMeta = $(".info-meta").last()
		if not lectureMeta?
			console.error "Meta element not found"
			# Stop any expired callbacks
			@_sendMessage tabId, false if @_isValidRequest requestId
			return

		mutator = new DomMutator lectureMeta
		# time has passed why waste bandwidth if invalidated
		mutator.addLink lecture.getHtmlLinkAudio() if @_isValidRequest requestId
		mutator.addLink lecture.getHtmlLinkVideo() if @_isValidRequest requestId

		if mutator.hasError()
			console.error "links not found"
			# Stop any expired callbacks
			@_sendMessage tabId, false if @_isValidRequest requestId
			return

		# don't make any changes if this request has expired
		if @_isValidRequest requestId
			do mutator.commitChanges
			@_sendMessage tabId, true

#let chrome know what to do if the content scripts receive a message
chrome?.runtime?.onMessage.addListener EchoDl.onMessage()
safari?.self?.addEventListener "message", EchoDl.onMessage(), false
