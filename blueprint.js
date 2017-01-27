
function parseDict(mydict, bpObj) {
	var dict = bpObj.ItemDictionary;
	
	var newDictList = {};
	for ( var index in dict ) {
		var id = dict[index];
		
		if ( typeof mydict[id] == 'object' ) {		
			var cost = mydict[id].cost;
			var category = mydict[id].category;
			newDictList[index] = {cost:cost, category:category};
		}
		//else { console.log("Could not find " + index + " : " + dict[index] + "\n"); }
	}
	return newDictList;
}


function getOutput( dict, blueprint ) {
	var bpObj = $.parseJSON(blueprint);	
	var outputString = "";
	var newDB = parseDict(dict,bpObj);
	var totals = {};
	var Blocks = bpObj.Blueprint.BlockIds;
	var totalBlocks = 0;
	for ( var b in Blocks ) {
		var index = Blocks[b];
		var cat = newDB[index].category;
		if ( isNaN(totals[cat]) ) { totals[cat] = 0; } 
		
		totals[cat] = parseFloat(newDB[index].cost) + parseFloat(totals[cat]) ;
		totalBlocks++;
		//console.log( "adding " + newDB[index].cost + " cost is now " + totals[cat]);
	}
	
	if ( typeof bpObj.Blueprint.SCs == 'object' ) {	
		for ( var so in bpObj.Blueprint.SCs ) {
			var Blocks = bpObj.Blueprint.SCs[so].BlockIds
			for ( var b in Blocks ) {
				var index = Blocks[b];
				var cat = newDB[index].category;
				if ( isNaN(totals[cat]) ) { totals[cat] = 0; } 
				
				totals[cat] = parseFloat(newDB[index].cost) + parseFloat(totals[cat]) ;
				totalBlocks++;	
			}
		}
	}
	
	outputString = "Total Blocks: " + totalBlocks + "<br>";
	var total = 0;
	outputString += "<br>Cost of blocks by category<br><br>";
	for ( var cat in totals ) {
		outputString += ( cat + ": " + totals[cat] + "<br>");
		total += parseFloat(totals[cat]);
	}
	outputString += "<br> Total Cost: " + total;
	return outputString;
}


$(document).ready(function(){
	$( "#run" ).click(function() { 
		//dictionary = $.parseJSON(dictString);
		$.getJSON( "ftdDB.json", function( dictionary ) {
		var blueprint = $( "#blueprint" ).val();
		$("#output").html( getOutput(dictionary,blueprint) );
		})
		
	})
})
