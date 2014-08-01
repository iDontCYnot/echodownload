class window.EchoDl

	#used to store most recently initiated request
	#will be useful when aync activities come into play
	@_REQUEST = 0

	#check whether a request is still valid
	@_isValidRequest: (requestId) ->
		console.log "Checking #{requestId} against #{@_REQUEST}"
		requestId >= @_REQUEST

	#inteprets background pages message
	@processMessage: (request, sender, callback) =>
		#pass required information to ED get+exec function
		@_getMetadataAndExecute request.url, callback

	#loads lecture metadata and begins process of adding download links
	@_getMetadataAndExecute: (url, callback) ->
		# closure to ensure data retention
		continuation_fn = (_reqId, _reqUrl, _callback) =>
			(data) => if @_isValidRequest _reqId
					@_processLecture data.presentation, _reqUrl, _reqId, _callback
		#ajax request
		$.ajax
			url: url
			async: false
			success: continuation_fn ++@_REQUEST, url, callback

	@_processLecture: (jsonData, url, requestId, callback) ->
		console.log "Processing Lecture"
		#make a lecture and start working with it
		lecture = new Lecture jsonData, url
		if lecture.hasError()
			console.error "Lecture not valid"
			# Stop any expired callbacks
			callback false if @_isValidRequest requestId
			return
		#grab meta element
		lectureMeta = $(".info-meta").last()
		if not lectureMeta?
			console.error "Meta element not found"
			# Stop any expired callbacks
			callback false if @_isValidRequest requestId
			return

		mutator = new DomMutator lectureMeta
		# time has passed why waste bandwidth if invalidated
		mutator.addLink lecture.getHtmlLinkAudio() if @_isValidRequest requestId
		mutator.addLink lecture.getHtmlLinkVideo() if @_isValidRequest requestId

		if mutator.hasError()
			console.error "links not found"
			# Stop any expired callbacks
			callback false if @_isValidRequest requestId
			return

		# don't make any changes if this request has expired
		if @_isValidRequest requestId
			do mutator.commitChanges
			callback true

#let chrome know what to do if the content scripts receive a message
chrome.runtime.onMessage.addListener EchoDl.processMessage
