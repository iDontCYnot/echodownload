//recieve a message from the background.JS
chrome.extension.onMessage.addListener( processMessage );

/**
* A method used to process a message sent from the background task
*/
function processMessage(request, sender, sendResponse) {
	// get json data for lecture
  	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("GET", request.url, false);
	xmlhttp.send();
	var data = JSON.parse(xmlhttp.responseText);
	// parse response
	var title = data.presentation.title;
	var uuid  = data.presentation.uuid;
	var date  = data.presentation.startTime;
	// TODO Get [vod|pod]cast link
	var vidLink = data.presentation.vodcast !== 'undefined';
	var audLink = data.presentation.podcast !== 'undefined';
	// Check casts exist
	if(!vidLink && !audLink){
		return;
	}
	// remove timezone from timestamp
	var tstamp = moment(date.replace( /([+-]\d{2}:\d{2}|Z)/i, ''));
	if(!tstamp.isValid()) 
		return;
	// grab the right click text element
	// if element is empty downloads are disabled - otherwise we can drop out
	var rightClickTextElement = $(".right-click-text").first();
	// set right click text to null
	if(rightClickTextElement != null)
		rightClickTextElement.html(null);
	// grab meta data container to place download links
	var lectureMeta = $(".info-meta").last();	  
	// check that nothing went wrong
	if(lectureMeta == null) 
		return;
	// get host URL
	var host = request.url.split( /(ess|ecp)/ )[0];
	if(host == null) 
		return;
	// Media URL beginning
	var presentation = host + tstamp.format("[echocontent/]YYWW[/]E[/]") + uuid;
	// filename
	var fname = title + tstamp.format(" [-] MMM Do");
	// make URL to file
	var afile = presentation + "/audio.mp3";
	var vfile = presentation + "/audio-vga.m4v";
	// Check if valid, never versions use different extension
	if(!checkValid(vfile)){
		vfile = presentation + "/audio-video.m4v";
	}
	// generate DOM data
	var heading = "<div class=\"info-key\">Downloads</div>";
	var aelement = "<div class=\"info-value\"><a href=" + afile + " download=\"" + fname + ".mp3\" title=\"Listen to MP3 Audio File\">Audio File</a></div>";
	var velement = "<div class=\"info-value\"><a href=" + vfile + " download=\"" + fname + ".m4v\" title=\"Watch M4V Video or Screen File\">Video File</a></div>";
	var links;
	// Both links
	if(vidLink && audLink){
		links = aelement + "<br>" + velement;
	} else if (vidLink){
		// Video link only
		links = velement;
	} else if (audLink){
		// Audio link only
		links = aelement;
	}
	// add DOM elements to page
	lectureMeta.html(heading + links);	
	sendResponse();
}

/**
* Checks if a url is valid
*/ 
function checkValid(URL){
	var returnValue;
	$.ajax({
        type: 'HEAD',
        url: URL,
        async: false,
        success: function() {
            returnValue = true;
        },
        error: function() {
            returnValue = false;
        }            
    });
    return returnValue;
}