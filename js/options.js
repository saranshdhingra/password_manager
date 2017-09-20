// var password=prompt("Input your password");

//change this method
// if(password=="testing"){
	chrome.runtime.sendMessage({action:'fetch_data'},function(response){
		var rows=response.result,
			html="",
			template=document.getElementById("row_template").innerHTML;
		for(var i=0;i<rows.length;i++){
			var row=rows[i],
				credentials=format_credentials(row.data),
				insert=replaceAll(template,{"{{serial}}":i,"{{host}}":row.host,"{{data}}":credentials,"{{time}}":format_time(row.time)});

			html+=insert;
		}
		document.getElementById("saved_records").getElementsByTagName("tbody")[0].innerHTML=html;
	});
// }

//pairs is an object, whose key is what to replace and value is what to replace with
function replaceAll(str,pairs){
	Object.keys(pairs).map(function(key){
		str=str.replace(new RegExp(key, 'g'), pairs[key]);
	});
	return str;
}


//helper func
function format_credentials(data){
	try{
		data=JSON.parse(data);
		var ret="";
		for(var i=0;i<data.length;i++){
			var field=data[i],
				name=field.name.length?field.name:"<em>Blank</em>",
				value=field.value.length?field.value:"<em>&lt;Blank&gt;</em>";
			ret+=name+":"+value+"<br>";
		}
		return ret;
	}
	catch(err){
		return "Error!";
	}
}

//simple helper to format the time string into our choice
function format_time(time_str){
	var obj=new Date(time_str),
		months_arr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

	return months_arr[obj.getMonth()]+"/"+pad_left(obj.getDate(),0,2)+"/"+obj.getFullYear()+" "+pad_left(obj.getHours(),0,2)+":"+pad_left(obj.getMinutes(),0,2);
}

//helper function, php equivalent: str_pad
function pad_left(str,char,length){
	return (String(char).repeat(length)+str).slice(-1*length);
}