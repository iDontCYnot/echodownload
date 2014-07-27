/**
* Performs DOM operations on the container
**/
function DomMutator(container){
	this.container = container;
	this.objects = new Array();
	this.errors = 0;
}

/**
* Takes a HtmlLink object and adds it to the DOM manipulators queue
**/
DomMutator.prototype.addLink = function(htmllink){
	if(!htmllink.isValid()){
		this.errors++;
	}
	this.objects.push(htmllink);
}

/**
* Returns whether more that one of the HtmlLink elements is invalid
**/
DomMutator.prototype.hasError = function(){
	return this.errors > 1;
}

/**
* Places the queues elements into the container after clearing the original contents
**/
DomMutator.prototype.commitChanges = function(){
	// stahhpp!
	if(this.hasError())
		return;
	// empty the container
	this.container.empty();
	// add the htmllinks
	for(var i in this.objects){
		if(i > 0){
			// break between
			this.container.append($("<br />"));
		}
		this.container.append(this.objects[i].toHTML());
	}
}
