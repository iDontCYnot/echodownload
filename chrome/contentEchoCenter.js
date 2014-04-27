var REQ = 0;
//recieve a message from the background.JS
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
	// hold whether file is present
	var vidLink = true;
	var audLink = true;
	// remove timezone from timestamp
	var tstamp = moment(date.replace( /([+-]\d{2}:\d{2}|Z)/i, ''));
	if(!tstamp.isValid()){
		error("Invalid timestamp");
		return;
	}
	// grab meta data container to place download links
	var lectureMeta = $(".info-meta").last();
	if(lectureMeta == null){
		error("Meta element not found");
		return;
	}
	// get directory name
	var dir = generateDirLink(resource, uuid, tstamp);
	if(dir == null){
		error("Directory not found - rmedia still an option");
	}
	log("Directory: " + dir);
	// set filename
	var fname = title + tstamp.format(" [-] MMM Do");
	// make URL to files
	var afile = makeAudioLink(dir, rmedia);
	if(afile == null){
		error("No audio file found");
		audLink = false;
	}
	log(afile);
	var vfile = makeVideoLink(dir, rmedia);
	if(vfile == null){
		error("No video file found");
		vidLink = false;
	}
	log(vfile);
	// Check casts exist
	if(!vidLink && !audLink){
		error("No links in data");
		return;
	}
	// generate DOM data
	var heading = $("<div class=\"info-key\">Downloads</div>");
	var aelement = makeLink(afile, fname, false);
	var velement = makeLink(vfile, fname, true);
	// Now lets not do anything silly
	if(req_id >= REQ){
		// remove old links
		lectureMeta.empty();
		// append heading
		lectureMeta.append(heading);
		// append links
		if(vidLink && audLink){
			// Both links
			lectureMeta.append(aelement)
			.append($("<br />"))
			.append(velement);
			log("Both links generated and available");
		} else if (vidLink){
			// Video link only
			lectureMeta.append(velement);
			log("only video link generated and available");
		} else if (audLink){
			// Audio link only
			lectureMeta.append(aelement);
			log("only audio link generated and available");
		}
		sendResponse();
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
	log("Host: "+host);
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
* Create link element
*/
function makeLink(href, fname, isVideo){
	if(href == null)
		return null;
	// extract extension
	var extension = findExtension(href);
	// element
	var element = $("<div>");
	element.addClass("info-value");
	// anchor
	var anch = $("<a>");
	anch.attr('href', href);
	anch.attr('download', fname + extension);
	anch.attr('title', isVideo ? "Download Video or Screen File" : "Download to Audio File" );
	anch.text( isVideo ? "Video File" : "Audio File" )
	// add anchor to element
	element.append(anch);
	return element;
}

/**
* A dirty method to extract the file extension from a href
*/
function findExtension(href){
	var split = href.split( /\./ );
	return '.' + split[split.length - 1];
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
