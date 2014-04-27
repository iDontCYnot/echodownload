DEBUG = true;

function log(message){
	if(DEBUG)
		console.log(message);
}

function error(message){
	if(DEBUG)
		console.error(message);
}