$content = Join-String -separator "`n" (Get-Content "spfbo.json")
$parts = $content -split '\n\}'

$parts | % {
	$book = $_
	$book += "`n}"
	$book = $book.Trim()
	
	if ($_ -match 'author.: \"(.*?)\"') {
		$author = $matches[1].ToLower()
		$author = $author -replace "\.", " " 
		$author = $author -replace "\s+", " " 
		$author = $author -replace " ", "-"
		$author
		
		$file = "data/$author.json"
		$book | Set-Content $file
	}
}
