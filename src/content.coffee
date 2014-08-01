_REQUEST = 0

processMessage = (request, sender, sendResult) ->
	# closure to ensure data retention
	success_fn = (_reqId, _reqUrl, _sendResult) ->
		(data) -> if _reqId >= _REQUEST
				processLecture data.presentation, _reqUrl, _reqId, _sendResult
	#ajax request
	$.ajax
		url: request.url
		async: false
		success: success_fn ++_REQUEST, request.url, sendResult


processLecture = (data, resource, request_id, sendResult) ->
	lecture = new Lecture data, resource
	if lecture.hasError()
		console.error "Lecture not valid"
		# Stop any expired callbacks
		callback false if request_id >= _REQUEST
		return

	lectureMeta = $(".info-meta").last()
	if not lectureMeta?
		console.error "Meta element not found"
		# Stop any expired callbacks
		sendResult false if request_id >= _REQUEST
		return

	mutator = new DomMutator lectureMeta
	mutator.addLink lecture.getHtmlLinkAudio()
	mutator.addLink lecture.getHtmlLinkVideo()
	if mutator.hasError()
		console.error "links not found"
		# Stop any expired callbacks
		sendResult false if request_id >= _REQUEST
		return

	# don't make any changes if this request has expired
	if request_id >= _REQUEST
		mutator.commitChanges()
		sendResult true

chrome.runtime.onMessage.addListener processMessage
