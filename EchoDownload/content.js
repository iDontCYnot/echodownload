/**
* A prototype method used to find the week number of a specific date
* source: http://javascript.about.com/library/blweekyear.htm
*/
Date.prototype.getWeek = function() {
  var onejan = new Date(this.getFullYear(),0,1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

checkStatus(); //ok go

/**
* Checkes whether downloads have been enabled officially - acts accordingly
*/
function checkStatus(){
  var meta = document.getElementsByClassName("meta");

  for(var x = 0; x < meta.length; x++){
    var download = meta[x].getElementsByClassName("download")[0];
    if(download){
      enableDownload(true);
      break;
    }
    else {
      enableDownload(false);
      break;
    }
  }
}

/**
* enables echo downloads. If downloads are officiall on it changes links
* to allow on-click downloads as well as file naming
*/
function enableDownload( isEnabled ){
  var week = document.body.getElementsByClassName("item lecture");
  for(var i = 0; i < week.length; i++){
    var ul = week[i].getElementsByClassName("meta")[0];
	//skip if this lecture is not recorded
	if(!ul) continue;
    //grab URL and expand
    var unitHash = ul.getElementsByTagName("a");
    //skip if this lecture has no hash;
    if(unitHash.length < 1){
      continue;
    }
    unitHash = unitHash[0].href;
    var start = unitHash.indexOf("presentation/");
    unitHash = unitHash.substring(start+13,unitHash.length);
    //Find URL using title
    var t = week[i].getElementsByTagName("strong")[0];
    var downurl = getURL(t) + unitHash;
    var filename = getName(t.parentElement.innerText);
    var vidurl = downurl + "/audio-vga.m4v";
    var audurl = downurl + "/audio.mp3";
    //Create and configure new element
    var new_element;
    if(isEnabled){
      new_element = ul.getElementsByClassName('download')[0];
    } else {
      new_element = document.createElement('li');
      new_element.className = "download";
      new_element.tabindex = "0";
      new_element.innerHTML = "<div class=\"dropdown\"><h5>Download</h5><ul><li class=\"audio\"><a target=\"_blank\">Audio podcast</a></li><li class=\"video\"><a target=\"_blank\">Video podcast</a></li></ul></div>";
    }
    //configure contents
    var anchor = new_element.getElementsByTagName("a");
    anchor[0].href = audurl;
	anchor[0].setAttribute('download', filename + ".mp3");
    anchor[1].href = vidurl;
	anchor[1].setAttribute('download', filename + ".m4v");
    //add element to list
    ul.insertBefore(new_element, ul.children[1]);
  }
}

/**
* Uses the week title to form a valid download url using the date.
*/
function getURL( t ){
  t = t.innerHTML;
  var start = t.indexOf(",&nbsp;");
  var end = t.lastIndexOf(":");
  t = t.substring(start+7,end);
  t = t.replace(/&nbsp;/g, " ");
  var date = new Date(t);
  return URLending(date);
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
* Uses the recording title in order to name the download file
*/
function getName( strong ){
  var plusIndex = strong.indexOf(' SPLUS');
  var colonIndex = strong.lastIndexOf(':');
  var date = strong.substring(0,colonIndex);
  var lect_info = strong.substring(colonIndex+1, plusIndex);
  return lect_info + date;
}