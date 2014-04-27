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
            	processLecture(data.presentation, request.url, sendResponse);
        	}
        }            
    });
}

/**
* Process Json data and present links to user
*/
function processLecture(data, resource, sendResponse){
	// parse response
	var title = data.title;
	var uuid  = data.uuid;
	var date  = data.startTime;
	var rmedia = data.richMedia;
	// TODO Get [vod|pod]cast link
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
	// check that nothing went wrong
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
	// generate DOM data
	var heading = $("<div class=\"info-key\">Downloads</div>");
	var aelement = makeLink(afile, fname, false);
	var velement = makeLink(vfile, fname, true);
	// Check casts exist
	if(!vidLink && !audLink){
		error("No links in data");
		return;
	}
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
	// Check if valid, different versions use different extension
	for(var i in files){
		if(checkValid(files[i]))
			return files[i];
	}
	return null;
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
	// Check if valid, different versions use different extension
	for(var i in files){
		if(checkValid(files[i]))
			return files[i];
	}
	return null;
}

/**
* Create link element
*/
function makeLink(href, fname, isVideo){
	// element
	var element = $("<div>");
	element.addClass("info-value");
	// anchor
	var anch = $("<a>");
	anch.attr('href', href);
	anch.attr('download', fname + ( isVideo ? ".m4v" : ".mp3" ));
	anch.attr('title', isVideo ? "Watch M4V Video or Screen File" : "Listen to MP3 Audio File" );
	anch.text( isVideo ? "Video File" : "Audio File" )
	// add anchor to element
	element.append(anch);
	return element;
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