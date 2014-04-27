DEBUG = true;

/**
* Log to the console
**/
function log(message){
	if(DEBUG)
		console.log(message);
}

/**
* Log to the error console
**/
function error(message){
	if(DEBUG)
		console.error(message);
}