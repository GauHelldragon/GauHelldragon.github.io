function convertDB( fileData ) {
	return "something";
}

function getOutput( dict, blueprint ) {
	return "wow";
}


$(document).ready(function(){
	$( "#run" ).click(function() { 
		$.ajax({
			url: "ftdDB.json",
			dataType : "json"
		}).done(function( DBfile ) {
			var dictionary = convertDB(DBfile);
			var blueprint = $( "#blueprint" ).text();
			$("#output").text( getOutput(dictionary,blueprint) );
			
		});
	})
})