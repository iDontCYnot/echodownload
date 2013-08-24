//recieve a message from the background.JS
chrome.extension.onMessage.addListener( processMessage );

/**
* A method used to process a message sent from the background task
*/
function processMessage(request, sender, sendResponse) {
  console.log("Message Recieved: ");
  console.log(request);
  if (request.uuid){
	  console.log("Recieved: " + request.uuid);
	  
	  //grab the right click text element
	  //if element is empty downloads are disabled - otherwise we can drop out
	  var rightClickTextElement = document.getElementsByClassName("right-click-text");
	  rightClickTextElement = rightClickTextElement.item(0);
	  
	  if(rightClickTextElement){
		  console.log("rightClickTextEl exists");
		  //set right click text
		  rightClickTextElement.innerHTML = "";
	  }
	  
	  //grab meta data for download links
	  var lectureMeta = document.getElementsByClassName("info-meta");
	  lectureMeta = lectureMeta.item(lectureMeta.length - 1);
	  
	  //check that nothing went wrong
	  if(lectureMeta){
		  //generate links
		  console.log("getting url");
		  var presentation = getURL();
		  if(!presentation) return; //break if something not right
		  presentation += request.uuid;
		  console.log(presentation);
		  var fname = getName();
		  if(!fname) return; //break if something went wrong
		  console.log(fname);
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
		  console.log("lectureMeta IS_NULL");
	  }
	}
}

/**
* A prototype method used to find the week number of a specific date
* source: http://javascript.about.com/library/blweekyear.htm
*/
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
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
function getName(){
	//grab date for file name
	var dateMeta = document.getElementsByClassName("info-meta");
	dateMeta = dateMeta.item(0);
	if(!dateMeta) return; //break out
	dateMeta = dateMeta.lastChild.innerHTML;
	if(!dateMeta) return; //break out
	var date = new Date(dateMeta);
	
	//grab page title to extract unit name
	var course = document.getElementsByClassName('course-info');
	course = course.item(0);
	if(!course) return; //break out
	course = course.innerHTML;
	var startCourse = course.lastIndexOf("[");
	var endCourse = course.lastIndexOf("]");
	if(startCourse < 0 || endCourse < 0) return; //break out
	startCourse ++;
	course = course.substring(startCourse, endCourse);
	
	//return course and recording date
	return course + " - " + date.getShortMonth() + " " + date.getDate()
}

/**
* Uses the date of capture to generate the date path in the url
*/
function URLending( date ){
  var head = "http://prod.lcs.uwa.edu.au:8080/echocontent/";
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

/**
* Uses the week title to form a valid download url using the date.
*/
function getURL(){
	//grab date of recording
	var dateMeta = document.getElementsByClassName("info-meta");
	dateMeta = dateMeta.item(0);
	if(!dateMeta) return; //break out
	dateMeta = dateMeta.lastChild.innerHTML;
	if(!dateMeta) return; //break out
	
	//grab year of recording
	var year = document.getElementsByClassName('course-info');
	year = year.item(0);
	if(!year) return; //break out
	year = year.innerHTML;
	var endDate = year.indexOf(" [");
	if(endDate < 0) return; //break out
	year = year.substring(0,endDate);
	year = year.substring(year.length-5, year.length);
	
	//create date using these values - use to generate url
	var date = new Date(dateMeta + year);
	return URLending(date);
}