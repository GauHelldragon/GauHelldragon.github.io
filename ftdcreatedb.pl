#!/usr/bin/perl
use warnings;







my $baseDir = "C:/Program Files (x86)/Steam/SteamApps/common/From The Depths/From_The_Depths_Data/StreamingAssets/Mods";
opendir my $dir, $baseDir or die "Cannot open $baseDir";
my @modDirs = readdir $dir;
closedir $dir;

foreach $mod (@modDirs) {
	
	my $modDirName = $baseDir . "/" . $mod . "/Items";
	my $modDirName2 = $baseDir . "/" . $mod . "/Item Duplicate and Modify";
	
	if ( -e $modDirName ) {
		#print ("Found " . $modDirName . "\n");
		opendir $dir, $modDirName;
		my @itemFiles = grep { /\.item$/ && -f "$modDirName/$_" } readdir($dir);
		#print ("$itemFiles[1]\n");		
		closedir $dir;
		foreach $itemfile (@itemFiles) { AddAItem("$modDirName/$itemfile",$mod); }
	}
	if ( -e $modDirName2 ) {
		#print ("Found " . $modDirName . "\n");
		opendir $dir, $modDirName2;
		my @itemFiles = grep { /\.itemduplicateandmodify$/ && -f "$modDirName2/$_" } readdir($dir);
		#print ("$itemFiles[1]\n");		
		closedir $dir;
		foreach $itemfile (@itemFiles) { AddAModifiedItem("$modDirName2/$itemfile",$mod); }
	}
	
	open(my $fh, ">", "ftdDB.json") or die("Could not open output file");
	print $fh "{\n";
	foreach $id (keys %itemCost) {
		print $fh "\"$id\": { \"cost\": \"$itemCost{$id}\", \"category\": \"$itemCat{$id}\"},\n ";

	}
	print $fh "}\n";
	close($fh);
	
}

sub AddAModifiedItem 
{
	my ($file,$mod) = @_;
	open(my $fh, "<", "$file") or return;
	my $costMulti = 0;
	my $id = "";
	my $parentID = "";
	
	while (<$fh>)	
	{
	
		if ( $_ =~ /"IdToDuplicate"/ ) {
			$next = <$fh>;
			$next = <$fh>;
			if ($next =~ /"Guid": "(.*)"/) { $parentID = $1 }
		}
		elsif ( $_ =~ /"ComponentId"/ ) { 
			$next = <$fh>;
			if ($next =~ /"Guid": "(.*)"/) { $id = $1 }
		}		
		elsif ( $_ =~ /"CostWeightHealthScaling": (.*),/ ) { $costMulti = $1 }
		
		if ( $id ne "" and $costMulti != 0 and $parentID ne "")  {
			my $parentCost = $itemCost{$parentID};
			my $cost = $parentCost * $costMulti;
			if ( $cost == 0 ) { print ( "Oh no! $id $parentID $costMulti\n" ); return; }
			$itemCost{$id} = $cost;
			$itemCat{$id} = $mod;
			# print "Added an item with cost $cost\n";
			return;
			
		
		}
	}
	print("$file\n");
}

sub AddAItem
{
	my ($file,$mod) = @_;
	open(my $fh, "<", "$file") or return;
	my $cost = 0;
	my $id = "";
	my $nextIsID = 0;
	
	while (<$fh>)	
	{
		if ( $nextIsID == 1 and $_ =~ /"Guid": "(.*)"/ ) { $id = $1 }		
		elsif ( $_ =~ /"Material": (.*)/ ) { $cost = $1 }
		elsif ( $_ =~ /"ComponentId":/ ) { $nextIsID = 1 }
		else { $nextIsID = 0; }
		
		if ( $id ne "" and $cost != 0 )  {
			$itemCost{$id} = $cost;
			$itemCat{$id} = $mod;
			# print "Added an item with cost $cost\n";
			return;
			
		
		}
	}
	print("$file\n");
}



