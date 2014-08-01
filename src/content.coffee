class window.EchoDownload

	@_REQUEST = 0

	@_isValidRequest: (requestId) ->
		requestId >= @_REQUEST

	@processMessage = (request, sender, callback) ->
		# closure to ensure data retention
		success_fn = (_reqId, _reqUrl, _callback) ->
			(data) -> if _reqId >= EchoDownload._REQUEST
					EchoDownload._processLecture data.presentation, _reqUrl, _reqId, _callback
		#ajax request
		$.ajax
			url: request.url
			async: false
			success: success_fn ++EchoDownload._REQUEST, request.url, callback

	@_getMetadataAndExecute = (url, callback) ->
		# closure to ensure data retention
		success_fn = (_reqId, _reqUrl, _callback) ->
			(data) -> if _reqId >= EchoDownload._REQUEST
					EchoDownload._processLecture data.presentation, _reqUrl, _reqId, _callback
		#ajax request
		$.ajax
			url: request.url
			async: false
			success: success_fn ++EchoDownload._REQUEST, request.url, callback


	@_processLecture = (data, resource, request_id, callback) ->
		lecture = new Lecture data, resource
		if lecture.hasError()
			console.error "Lecture not valid"
			# Stop any expired callbacks
			callback false if request_id >= EchoDownload._REQUEST
			return

		lectureMeta = $(".info-meta").last()
		if not lectureMeta?
			console.error "Meta element not found"
			# Stop any expired callbacks
			callback false if request_id >= EchoDownload._REQUEST
			return

		mutator = new DomMutator lectureMeta
		mutator.addLink lecture.getHtmlLinkAudio()
		mutator.addLink lecture.getHtmlLinkVideo()
		if mutator.hasError()
			console.error "links not found"
			# Stop any expired callbacks
			callback false if request_id >= EchoDownload._REQUEST
			return

		# don't make any changes if this request has expired
		if request_id >= EchoDownload._REQUEST
			do mutator.commitChanges
			callback true

chrome.runtime.onMessage.addListener EchoDownload.processMessage
