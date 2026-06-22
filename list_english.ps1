$json = Get-Content bibles_utf8.json -Raw | ConvertFrom-Json
$bibles = $json.results
foreach ($module in $bibles.psobject.properties) {
    if ($module.Value.lang -eq "English") {
        Write-Host "$($module.Name) : $($module.Value.name)"
    }
}
