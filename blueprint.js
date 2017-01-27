function parseDict(mydict, bpObj) {
	var dict = bpObj.ItemDictionary;
	
	var newDictList = {};
	for ( var index in dict ) {
		var id = dict[index];
		
		var cost = mydict[id].cost;
		var category = mydict[id].category;
		
		newDictList[index] = {cost:cost, category:category};
	}
	return newDictList;
}


function getOutput( dict, blueprint ) {
	var bpObj = $.parseJSON(blueprint);	
	var outputString = "";
	var newDB = parseDict(dict,bpObj);
	var totals = {};
	var Blocks = bpObj.Blueprint.BlockIds;
	for ( var b in Blocks ) {
		var index = Blocks[b];
		var cat = newDB[index].category;
		totals[category] += newDB[index].cost;
	}
	for ( var cat in totals ) {
		outputString += cat += ": " + totals[cat] + "<br>";
	}
	return outputString;
}


$(document).ready(function(){
	$( "#run" ).click(function() { 
		$.ajax({
			url: "ftdDB.json",
			dataType : "json"
		}).done(function( dictionary ) {
			var blueprint = $( "#blueprint" ).text();
			$("#output").text( getOutput(dictionary,blueprint) );
			
		});
	})
})