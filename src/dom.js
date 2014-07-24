/**
* Add links to DOM
**/
function addToDOM(meta_el, aud_href, vid_href, fname){
	// remove old links
	meta_el.empty();
	// append heading
	meta_el.append($("<div class=\"info-key\">Downloads</div>"));
	// create links
	var aelement = makeLink(aud_href, fname, false);
	var velement = makeLink(vid_href, fname, true);
	// append links
	meta_el.append(aelement)
		.append($("<br />"))
		.append(velement);
}

/**
* Create link element
*/
function makeLink(href, fname, isVideo){
	// element
	var element = $("<div>");
	element.addClass("info-value");
	// Check resource is available
	if(href == null){
		// make dead link
		console.log((isVideo ? "Video " : "Audio ") + "link is dead");
		element.text(isVideo ? "Video Unavailable" : "Audio Unavailable");
	} else {
		// extract extension
		var extension = findExtension(href);
		// anchor
		var anch = $("<a>")
			.attr('href', href)
			.attr('download', fname + extension)
			.attr('title', isVideo ? "Download Video or Screen File" : "Download to Audio File" )
			.text( isVideo ? "Video File" : "Audio File" );
		// add anchor to element
		element.append(anch);
	}
	return element;
}

/**
* A dirty method to extract the file extension from a href
*/
function findExtension(href){
	var split = href.split( /\./ );
	return '.' + split[split.length - 1];
}
