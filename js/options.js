// var password=prompt("Input your password");

//change this method
// if(password=="testing"){
	fetch_data();
// }

$("body").on("click",".edit_data",function(e){
	e.preventDefault();
	$(this).parents("tr").addClass("editing");
});

$("body").on("click",".delete_data",function(e){
	e.preventDefault();
	var choice=confirm("Are you sure? This can't be undone!"),
		id=$(this).parents("tr").attr("data-id");
	if(choice===true){
		chrome.runtime.sendMessage({action:'delete_data',id:id},function(response){
			alert(response.msg);
			fetch_data();
		});
	}
});

$("body").on("click",".save_btn",function(){
	var row=$(this).parents("tr"),
		inputs=row.find(".data_cell").find("input[type='text']"),
		data=[];

	for(var i=0;i<inputs.length;i++){
		var input=inputs[i];

		data.push({'name':input.name,'value':input.value});
	}

	row.removeClass("editing");
	chrome.runtime.sendMessage({action:'edit_data',data:JSON.stringify(data),id:row.attr("data-id")},function(response){
		alert(response.msg);
		fetch_data();
	});
});

function fetch_data(){
	chrome.runtime.sendMessage({action:'fetch_data'},function(response){
		var rows=response.result,
			html="",
			template=$("#row_template").html();
		for(var i=0;i<rows.length;i++){
			var row=rows[i],
				credentials=format_credentials(row.data),
				insert=replaceAll(template,{"{{id}}":row.id,"{{serial}}":i+1,"{{host}}":row.host,"{{data}}":credentials,"{{time}}":format_time(row.time)});

			html+=insert;
		}
		$("#saved_records").find("tbody").html(html);
	});
}

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
			// console.log(data[i]);
			var field=data[i],
				name=field.name.length?field.name:"<em>Blank</em>",
				value=field.value.length?field.value:"<em>&lt;Blank&gt;</em>";
			ret+="<div class='field'>" + 
					name + 
					": <input type='text' name='"+name+"' value='"+value+"' >" + 
					"<span class='value'>"+value+"</span></div>";
		}
		return ret;
	}
	catch(err){
		console.log(err);
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