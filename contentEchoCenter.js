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
	  var jsondata = JSON.parse(xmlhttp.responseText);
	  var title = jsondata.presentation.title;
	  var uuid  = jsondata.presentation.uuid;
	  var date  = jsondata.presentation.startTime;
	  //extract date, time
	  console.log("Date before change " + date);
	  date = new Date( date.match(/\d{4}-\d{2}-\d{2}/) );
	  console.log("Date after change " + date);
	  if(!date) return;
	  //console.log(request.url);
	  //console.log(title);
	  //console.log(uuid);
	  //console.log(date);
	  
	  //grab the right click text element
	  //if element is empty downloads are disabled - otherwise we can drop out
	  var rightClickTextElement = document.getElementsByClassName("right-click-text");
	  rightClickTextElement = rightClickTextElement.item(0);
	  
	  if(rightClickTextElement){
		  //console.log("rightClickTextEl exists");
		  //set right click text
		  rightClickTextElement.innerHTML = "";
	  }
	  
	  //grab meta data container to place download links
	  var lectureMeta = document.getElementsByClassName("info-meta");
	  lectureMeta = lectureMeta.item(lectureMeta.length - 1);
	  
	  //check that nothing went wrong
	  if(lectureMeta){
		  //generate links
		  //console.log("getting url");
		  var host = request.url.split(/(ess|ecp)/)[0];
		  if(!host) return;
		  //console.log(host);
		  var presentation = getURL( date, host );
		  if(!presentation) return; //break if something not right
		  presentation += request.uuid;
		  //console.log(presentation);
		  var fname = getName( date, title );
		  if(!fname) return; //break if something went wrong
		  //console.log(fname);
		  var afile = presentation + "/audio.mp3";
		  var vfile = presentation + "/audio-vga.m4v";
		  
		  //generate DOM data
		  var heading = "<div class=\"info-key\">Downloads</div>";
		  var aelement = "<div class=\"info-value\"><a href=" + afile + " download=\"" + fname + ".mp3\" title=\"Listen to MP3 Audio File\">Audio File</a></div>";
		  var velement = "<div class=\"info-value\"><a href=" + vfile + " download=\"" + fname + ".m4v\" title=\"Watch M4V Video or Screen File\">Video File</a></div>";

		  //add DOM elements to page
		  lectureMeta.innerHTML = heading + aelement + "<br>" + velement;	
		  //tell background that its been done
		  sendResponse("the deed is done");	  
	  } else {
		  //console.log("lectureMeta IS_NULL");
	  }
	}
}

/**
* A prototype method used to find the week number of a specific date
* source: http://javascript.about.com/library/blweekyear.htm
*/
Date.prototype.getWeek = function() {
  var oneday = 86400000
  //round one jan to be nearest sunday, this is week one
  var eps = new Date(this.getFullYear()+1,0,1);
  var end = this.getTime() + oneday;
  do {
  	  //go to past year
  	  eps = new Date(eps.getFullYear()-1,0,1);
	  var s;
	  //find closest sunday
	  if(eps.getDay() < 3)
	    s = 0;
	  else 
	  	s = 7;
	  //calculate to closest sunday
	  eps = new Date(eps.getTime() + oneday*(s-eps.getDay()));
  } while(eps > end) //continue until eps comes before end
  //  604800000 means 1000(s) * 60(m) * 60(h) * 24(d) * 7(w)
  var week = Math.ceil((end - eps) / 604800000);
  //if goes into next year - fix
  if(week > 52)
  	week - (Math.round(week / 52) * 52)
  return week;
}

/**
* Get a short version of the month as a string
*/
Date.prototype.getShortMonth = function() {
	switch(this.getMonth()){
		case 0:
			return "Jan";
			break;
		case 1:
			return "Feb";
			break;
		case 2:
			return "Mar";
			break;
		case 3:
			return "Apr";
			break;
		case 4:
			return "May";
			break;
		case 5:
			return "Jun";
			break;
		case 6:
			return "Jul";
			break;
		case 7:
			return "Aug";
			break;
		case 8:
			return "Sept";
			break;
		case 9:
			return "Oct";
			break;
		case 10:
			return "Nov";
			break;
		case 11:
			return "Dec";
			break;
	}
}

/**
* Uses the recording title in order to name the download file
*/
function getName( dateTime, title ){
	var date = new Date( dateTime );
	//return course and recording date
	return title + " - " + date.getShortMonth() + " " + date.getDate()
}

/**
* Uses the week title to form a valid download url using the date.
*/
function getURL( dateTime, host ){
	console.log("Creating url with " + dateTime);
	var date = new Date( dateTime );//dateMeta + year);
	console.log("Generated date object " + date);
	var head = host + "echocontent/";
    //parse year
	var y = date.getFullYear().toString().substring(2,4);
	//parse week
	var w = date.getWeek().toString();
	if(w.length < 2){
	  w = "0"+w;
	}
	//parse day
	var d = date.getDay();
	if(d == 0){
	  d = 7;
    }
	return head + y + w + "/" + d + "/";
}