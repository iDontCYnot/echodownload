// Store link location, extension and type as a JS object
function ResourceLink(href, extension, isVideo){
	this.href = href;
	this.extension = extension;
	this.isVideo = isVideo;
	this.validityChecks = 0; // nums of times isValid was called
	this.lastValidityResult = false;
}

/**
* Checks if a url is valid by checking for success when requesting headers
*/
ResourceLink.prototype.isValid = function(){
	// increment call count
	this.validityChecks++;
	console.log("isValid has been called " + this.validityChecks + " times");
	if(this.href == null){
		// null link
		this.lastValidityResult = false;
		return false;
	} else {
		// Don't reload headers if we have a result
		if(this.validityChecks > 1){
			return this.lastValidityResult;
		}
		// check for response headers
		var isValid;
		$.ajax({
	        type: 'HEAD',
	        url: this.href,
	        async: false,
	        success: function() {
	            isValid = true;
	        },
	        error: function() {
	            isValid = false;
	        }
	    });
	    this.lastValidityResult = isValid;
	    return isValid;
	}
}
