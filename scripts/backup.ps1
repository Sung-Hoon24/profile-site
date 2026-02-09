$date = Get-Date -Format "yyyyMMdd-HHmm"
$backupDir = "C:\1.APPs\Backups\profile-site-v2\$date"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$exclude = @("node_modules", "dist", ".git", "test-build-3", "chrome_profile_notebooklm")

Get-ChildItem -Path "C:\1.APPs\개인웹페이지\profile-site-v2" | ForEach-Object {
    if ($exclude -notcontains $_.Name) {
        Copy-Item -Path $_.FullName -Destination $backupDir -Recurse -Force
    }
}

Write-Host "Backup completed to $backupDir"
