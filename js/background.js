chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	if(request.action=="record")
		start_recording(sender.tab);
	sendResponse({});
});

function start_recording(sender){
	console.log(sender);
	if(!sender.id)
		return;
	chrome.webRequest.onBeforeRequest.addListener(function(request){
		if(request.method=="POST"){
			log_data_from_request(request.requestBody.formData);
		}
		console.log(request);
		return {};
	},{
		urls:["<all_urls>"],
		tabId:sender.id
	},["blocking","requestBody"]);
}

function end_recording(){
	
}

//log the data here into a DB perhaps
function log_data_from_request(body){

}