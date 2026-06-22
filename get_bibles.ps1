$response = Invoke-RestMethod -Uri "https://api.biblesupersearch.com/api/bibles"
$bibles = $response.bibles
$bibles | Get-Member -MemberType NoteProperty | ForEach-Object {
    $module = $_.Name
    $info = $bibles.$module
    if ($info.lang -eq "English") {
        Write-Host "$module : $($info.name)"
    }
}
