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
        async: false,
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
	var title = data.title;
	var uuid  = data.uuid;
	var date  = data.startTime;
	var rmedia = data.richMedia;
	// remove timezone from timestamp
	var tstamp = moment(date.replace( /([+-]\d{2}:\d{2}|Z)/i, ''));
	if(!tstamp.isValid()){
		console.error("Invalid timestamp");
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
	// get directory name
	var dir = generateDirLink(resource, uuid, tstamp);
	if(dir == null){
		console.error("Directory not found - rmedia still an option");
	}
	console.log("Directory: " + dir);
	// set filename
	var fname = title + tstamp.format(" [-] MMM Do");
	// make URL to files
	var afile = makeAudioLink(dir, rmedia);
	if(afile == null){
		console.error("No audio file found");
	}
	console.log(afile);
	var vfile = makeVideoLink(dir, rmedia);
	if(vfile == null){
		console.error("No video file found");
	}
	console.log(vfile);
	// Check casts exist
	if(vfile == null && afile == null){
		console.error("No links in data");
		sendResponse(false);
		return;
	}
	// Now lets not do anything silly
	if(req_id >= REQ){
		// add links to DOM and send response to background
		addToDOM(lectureMeta, afile, vfile, fname);
		sendResponse(true);
	}
}

/**
*	generate directory link using host and timestamp / uuid
*/
function generateDirLink(resource, uuid, tstamp){
	// get host URL
	var host = resource.split( /(ess\/|ecp\/)/ )[0];
	if(host == null){
		return null;
	}
	console.log("Host: "+host);
	// Media URL beginning
	return host + tstamp.format("[echocontent/]YYWW[/]E[/]") + uuid;
}

/**
*	generate direct link to audio file
*/
function makeAudioLink(dir, rmedia){
	var files = [
		dir + "/audio.mp3",
		dir + "/audio_1.aac",
		rmedia + "/mediacontent.mp3"
	];
	return firstAvailableURL(files);
}

/**
*	generate direct link to video file
*/
function makeVideoLink(dir, rmedia){
	var files = [
		dir + "/audio-vga.m4v",
		dir + "/audio-video.m4v",
		rmedia + "/mediacontent.m4v"
	];
	return firstAvailableURL(files);
}

/**
* Checks an ordered list and return the first valid URL
*/
function firstAvailableURL(urls){
	// Check if valid, different versions use different extension
	for(var i in urls){
		if(checkValid(urls[i]))
			return urls[i];
	}
	return null;
}

/**
* Checks if a url is valid by checking for success when requesting headers
*/
function checkValid(URL){
	var isValid;
	$.ajax({
        type: 'HEAD',
        url: URL,
        async: false,
        success: function() {
            isValid = true;
        },
        error: function() {
            isValid = false;
        }
    });
    return isValid;
}
