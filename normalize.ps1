# Normalize all the files.
ls data/*.json | % {
	$a = $_.Name.ToLower().Replace(" ", "-");
	
	if ($_.Name -ne $a)
	{
		Write-Host $a
		$name = $_.Name
		move "data/$name" "data/$a"
	}
}

# Rebuild the index.
$index = "[`n"

ls data/*.json | % {
	$n = $_.Name.Replace(".json", "")
	
	if ($n -ne "index") {
		$index += "    `"$n`",`n"
	}
}

$index += "]`n"
$index = $index.Replace('",' + "`n" + ']', '"' + "`n" + ']')

$index

$index | Set-Content data/index.json