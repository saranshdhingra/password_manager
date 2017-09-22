// var password=prompt("Input your password");
var saved_records=[];

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

$("#show_names").on("change",function(){
	if($(this).prop('checked'))
		$("#saved_records").addClass("show_field_names");
	else
		$("#saved_records").removeClass("show_field_names");

	filter_data();
});

$("#filter").on("keyup change",function(){
	filter_data();
})

function fetch_data(){
	window.saved_records=[];
	chrome.runtime.sendMessage({action:'fetch_data'},function(response){
		var rows=response.result;

		rows.map(function(row){
			window.saved_records.push({
				id:row.id,
				host:row.host,
				data:JSON.parse(row.data),
				time:format_time(row.time)
			});
		});

		filter_data();
	});
}

//this function filters through the saved_records and inserts the html in our table
function filter_data(){
	var html="",
		template=$("#row_template").html();
	$(window.saved_records).each(function(i){
		var matched=match_in_record(this);
		if(matched){
			var credentials=format_credentials(this.data),
				insert=replaceAll(template,{"{{id}}":this.id,"{{serial}}":i+1,"{{host}}":this.host,"{{data}}":credentials,"{{time}}":format_time(this.time)});

			html+=insert;
		}
	});
	$("#saved_records").find("tbody").html(html);
}


function match_in_record(record){
	var filter=$("#filter").val().trim(),
		matched=false;
	if(filter.length==0)
		return true;

	//firstly simply match in host or time
	if(record.host.indexOf(filter)!=-1 || record.time.indexOf(filter)!=-1)
		matched=true;
	//now match in each field values
	$(record.data).each(function(){
		if(this.value.indexOf(filter)!=-1){
			matched=true;
			return;
		}
		if($("#saved_records").hasClass("show_field_names") && this.name.indexOf(filter)!=-1){
			matched=true;
			return;
		}
	});

	return matched;
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
	var ret="";
	for(var i=0;i<data.length;i++){
		// console.log(data[i]);
		var field=data[i],
			name=field.name.length?field.name:"<em>Blank</em>",
			value=field.value.length?field.value:"<em>&lt;Blank&gt;</em>";
		ret+="<div class='field'>" + 
				"<span class='field_name'>"+name + ": </span>" +
				"<input type='text' name='"+name+"' value='"+value+"' >" + 
				"<span class='value'>"+value+"</span></div>";
	}
	return ret;
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