// Store link location, extension and type as a JS object
function ResourceLink(href, extension, isVideo){
	this.href = href;
	this.extension = extension;
	this.isVideo = isVideo;
}

/**
* Checks if a url is valid by checking for success when requesting headers
*/
ResourceLink.prototype.isValid = function(){
	if(this.href == null){
		// null link
		return false;
	} else {
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
	    return isValid;
	}
}
