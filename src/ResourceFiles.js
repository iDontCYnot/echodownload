//an object storing potential resources for lectures
var ResourceFiles = {
	//returns an array of possible audio links for a lecture
	getAudioResource : function(lecture){
		var d = lecture.getDirectory();
		var r = lecture.richMedia;
		//return first resource - ordered best to worst - null resource returned if none valid
		var s = [
			new ResourceLink(d + "/audio.mp3", "mp3", false),
			new ResourceLink(d + "/audio_1.aac", "aac", false),
			new ResourceLink(r + "/mediacontent.mp3", "mp3", false),
			new ResourceLink(null, null, false) //Terminating object
		];
		return this.firstUsefulLink(s);
	},

	//returns an array of possible audio links for a lecture
	getVideoResource : function(lecture){
		var d = lecture.getDirectory();
		var r = lecture.richMedia;
		//return first resource - ordered best to worst - null resource returned if none valid
		var s = [
			new ResourceLink(d + "/audio-vga.m4v", "m4v", true),
			new ResourceLink(d + "/audio-video.m4v", "m4v", true),
			new ResourceLink(r + "/mediacontent.m4v", "m4v", true),
			new ResourceLink(null, null, true) //Terminating object
		];
		return this.firstUsefulLink(s);
	},

	// returns last link if none are valid
	firstUsefulLink : function(links){
		for(var i in links){
		if(links[i].isValid())
			return links[i];
		}
		return links[links.length-1];
	}

}
