/**
* Lecture class representing an available lecture recording
**/
function Lecture(data, resource){
	this.title = data.title;
	this.uuid  = data.uuid;
	this.thumbnails = data.thumbnails;
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
	// Get dir from thumbnails
	if(typeof this.thumbnails != 'undefined' && this.thumbnails[0] != null){
		var matcher = new RegExp(".+" + this.uuid, "i");
		var thumbDir = matcher.exec(this.thumbnails[0])[0];
		console.log("Using thumbnails to grab directory");
		console.log(thumbDir);
		// did the thumbnails give us a directory?
		if(thumbDir != null){
			return thumbDir;
		}
	}
	// If somehow using thumbnails fails, we can use the timestamp to make out own URL
	// get host URL
	var host = this.resource.split( /(ess\/|ecp\/)/ )[0];
	if(host == null){
		return null; // lost cause?
	}
	console.log("Generating Dir - Host: " + host);
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
	return new HtmlLink(res, this.getLectureName());
}

/**
* returns an HtmlLink pretaining to the video resurce
**/
Lecture.prototype.getHtmlLinkVideo = function(){
	var res = ResourceFiles.getVideoResource(this);
	return new HtmlLink(res, this.getLectureName());
}
