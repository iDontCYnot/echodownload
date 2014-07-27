/**
* Lecture class representing an available lecture recording
**/
function Lecture(data, resource){
	this.title = data.title;
	this.uuid  = data.uuid;
	this.date  = moment(data.startTime.replace(/([+-]\d{2}:\d{2}|Z)/i, ''));
	this.richMedia = data.richMedia;
	this.resource = resource;
	this.errors = 0;
}

/**
* returns whether the lecture contains an error which would make it invalid
**/
Lecture.prototype.hasError = function(){
	return !this.date.isValid();
}

/**
* returns the server directory containing lecture information and files
**/
Lecture.prototype.getDirectory = function(){
	// get host URL
	var host = this.resource.split( /(ess\/|ecp\/)/ )[0];
	if(host == null){
		return null;
	}
	console.log("Host: " + host);
	// Media URL beginning
	return host + this.date.format("[echocontent/]YYWW[/]E[/]") + this.uuid;
}

/**
* returns a suitable name for the recording file
**/
Lecture.prototype.getLectureName = function(){
	return this.title + this.date.format(" [-] MMM Do");
}

/**
* returns an HtmlLink pretaining to the audio resurce
**/
Lecture.prototype.getHtmlLinkAudio = function(){
	var res = ResourceFiles.getAudioResource(this);
	return new HtmlLink(res, this.getLectureName);
}

/**
* returns an HtmlLink pretaining to the video resurce
**/
Lecture.prototype.getHtmlLinkVideo = function(){
	var res = ResourceFiles.getVideoResource(this);
	return new HtmlLink(res, this.getLectureName);
}
