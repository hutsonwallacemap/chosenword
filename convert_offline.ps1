$books = @(
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", 
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", 
  "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon", 
  "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", 
  "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", 
  "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", 
  "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", 
  "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", 
  "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
)

$output = @{}

for ($i = 1; $i -le 66; $i++) {
    $bookNum = $i.ToString("00")
    $bookName = $books[$i-1]
    $output[$bookName] = @{}
    
    $dirPath = "temp_unzip\in_new\$bookNum"
    if (Test-Path $dirPath) {
        $files = Get-ChildItem -Path $dirPath -Filter "*.htm"
        foreach ($file in $files) {
            $chapterNum = $file.BaseName
            $output[$bookName][$chapterNum] = @{}
            
            $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
            
            $pattern = '(?s)<span class="verse"[^>]*>\d+\s*</span>(.*?)(?=<br\s*/?>|</p>)'
            $matches = [regex]::Matches($content, $pattern)
            
            $vNum = 1
            foreach ($match in $matches) {
                $verseText = $match.Groups[1].Value.Trim()
                # Remove any leftover HTML tags like <a> or <span>
                $verseText = $verseText -replace '<[^>]+>', ''
                $output[$bookName][$chapterNum][$vNum.ToString()] = $verseText
                $vNum++
            }
        }
    }
}

$output | ConvertTo-Json -Depth 5 -Compress | Out-File -FilePath "public\hindi_offline.json" -Encoding UTF8
