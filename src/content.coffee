REQUEST = 0

processMessage = (request, sender, callback) ->
	REQUEST++
	request_id = REQUEST
	$.ajax
	url: request.url
	async: false
	success: (data) ->
		if request_id >= REQUEST
			processLecture data.presentation, request.url, callback, request_id

processLecture = (data, resource, callback, request_id) ->
	lecture = new Lecture data, resource
	if lecture.hasError()
		console.error "Lecture not valid"
		callback false
		return

	lectureMeta = $(".info-meta").last()
	if not lectureMeta?
		console.error "Meta element not found"
		callback false
		return

	mutator = new DomMutator lectureMeta
	mutator.addLink lecture.getHtmlLinkAudio()
	mutator.addLink lecture.getHtmlLinkVideo()
	if mutator.hasError()
		console.error "links not found"
		callback false
		return

	if request_id >= REQUEST
		mutator.commitChanges()
		callback true

chrome.extension.onMessage.addListener processMessage
