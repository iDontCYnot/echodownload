//recieve a message from the background.JS
chrome.extension.onMessage.addListener( processMessage );

/**
* A method used to process a message sent from the background task
*/
function processMessage(request, sender, sendResponse) {
  //console.log("Message Recieved: ");

  if (request.uuid){
	  //console.log("Recieved: " + request);
      //get json data for lecture
	  xmlhttp=new XMLHttpRequest();
	  xmlhttp.open("GET", request.url,false);
	  xmlhttp.send();
	  //parse response
	  var data = JSON.parse(xmlhttp.responseText);
	  var title = data.presentation.title;
	  var uuid  = data.presentation.uuid;
	  console.log(uuid);
	  var date  = data.presentation.startTime;
	  //extract date, time
	  var tz_regex = /[+-]\d{2}:\d{2}/i
	  var dt = moment(date.replace(tz_regex, ''));
	  if(!dt.isValid()) return;
	  //grab the right click text element
	  //if element is empty downloads are disabled - otherwise we can drop out
	  var rightClickTextElement = $(".right-click-text").first();
	  if(rightClickTextElement){
		  //set right click text
		  rightClickTextElement.html(null);
	  } 
	  //grab meta data container to place download links
	  var lectureMeta = $(".info-meta").last();	  
	  //check that nothing went wrong
	  if(lectureMeta){
		  //generate links
		  var host = request.url.split(/(ess|ecp)/)[0];
		  if(!host) return;
		  //console.log(host);
		  var presentation = getURL( dt, host );
		  if(!presentation) return; //break if something not right
		  presentation += request.uuid;
		  //console.log(presentation);
		  var fname = getName( dt, title );
		  if(!fname) return; //break if something went wrong
		  //console.log(fname);
		  var afile = presentation + "/audio.mp3";
		  var vfile = presentation + "/audio-vga.m4v";	  
		  //generate DOM data
		  var heading = "<div class=\"info-key\">Downloads</div>";
		  var aelement = "<div class=\"info-value\"><a href=" + afile + " download=\"" + fname + ".mp3\" title=\"Listen to MP3 Audio File\">Audio File</a></div>";
		  var velement = "<div class=\"info-value\"><a href=" + vfile + " download=\"" + fname + ".m4v\" title=\"Watch M4V Video or Screen File\">Video File</a></div>";

		  //add DOM elements to page
		  lectureMeta.html(heading + aelement + "<br>" + velement);	
		  //tell background that its been done
		  //sendResponse("the deed is done");	  
	  } else {
		  //console.log("lectureMeta IS_NULL");
	  }
	}
}

/**
* Uses the recording title in order to name the download file
*/
function getName( dt, title ){
	//return course and recording date
	return title + " - " + dt.format("MMM Do")
}

/**
* Uses the week title to form a valid download url using the date.
*/
function getURL( dt, host ){
	//console.log("Creating url with " + dt);
	var head = host + "echocontent/";
	console.log("url ending " + head + dt.format("YYWW[/]E[/]"));
	//console.log("day: "+ dt.format("dd") + " number: "+dt.format("E"));
	return head + dt.format("YYWW[/]E[/]");
}