/**
* Stores a ResourceLink and associated filename
* used to pass and write to HTML
**/
function HtmlLink(resource, filename){
	this.resource = resource;
	this.filename = filename;
}

/**
* returns an HTML element based on the ResourceLink and filename
*/
HtmlLink.prototype.toHTML = function(){
	// element
	var element = $("<div>");
	element.addClass("info-value");
	// Check resource is available
	if(!this.resource.isValid()){
		// make dead link
		console.log((this.resource.isVideo ? "Video" : "Audio") + " link is dead");
		element.text((this.resource.isVideo ? "Video" : "Audio") + " Unavailable");
	} else {
		// anchor
		var anch = $("<a>")
			.attr('href', this.resource.href)
			.attr('download', this.filename + this.resource.extension)
			.attr('title', this.resource.isVideo ? "Download Video or Screen File" : "Download to Audio File" )
			.text( this.resource.isVideo ? "Video File" : "Audio File" );
		// add anchor to element
		element.append(anch);
	}
	return element;
}

/**
* Returns whether HTML element is static (no href)
**/
HtmlLink.prototype.isValid = function(){
	return this.resource.isValid();
}
