var REQ = 0;
//recieve a message from the background.js
chrome.extension.onMessage.addListener( processMessage );

/**
* A method used to process a message sent from the background task
*/
function processMessage(request, sender, sendResponse) {
	// Set ID
	var request_id = ++REQ;
	// get json data for lecture
	$.ajax({
        url: request.url,
        success: function(data) {
        	// Check for latest request before processing
        	if(request_id >= REQ){
        		// pass request_id just in case
            	processLecture(data.presentation, request.url, sendResponse, request_id);
        	}
        }
    });
}

/**
* Process Json data and present links to user
*/
function processLecture(data, resource, sendResponse, req_id){
	// parse response
	var lecture = new Lecture(data, resource);
	if(lecture.hasError()){
		console.error("Lecture not valid");
		sendResponse(false);
		return;
	}
	// grab meta data container to place download links
	var lectureMeta = $(".info-meta").last();
	if(lectureMeta == null){
		console.error("Meta element not found");
		sendResponse(false);
		return;
	}
	// get the dom manipulation going
	var mutator = new DomMutator(lectureMeta);
	// add links provided by lecture
	mutator.addLink(lecture.getHtmlLinkAudio());
	mutator.addLink(lecture.getHtmlLinkVideo());
	if(mutator.hasError()){
		// more than one dead link
		console.error("links not found");
		sendResponse(false);
		return;
	}

	// Now lets not do anything silly - small concurrency safety
	if(req_id >= REQ){
		// add links to DOM and send response to background
		mutator.commitChanges();
		sendResponse(true);
	}
}
