# PowerShell script to clean .next directory on Windows
# Handles file locking issues gracefully

$nextDir = Join-Path $PSScriptRoot "..\.next"

if (Test-Path $nextDir) {
    Write-Host "Cleaning .next directory..."
    try {
        # Try to remove with retry logic
        $maxRetries = 3
        $retryCount = 0
        $success = $false
        
        while ($retryCount -lt $maxRetries -and -not $success) {
            try {
                Remove-Item -Path $nextDir -Recurse -Force -ErrorAction Stop
                $success = $true
                Write-Host "Successfully cleaned .next directory"
            } catch {
                $retryCount++
                if ($retryCount -lt $maxRetries) {
                    Write-Host "Retry $retryCount/$maxRetries - waiting 2 seconds..."
                    Start-Sleep -Seconds 2
                } else {
                    Write-Host "Warning: Could not fully clean .next directory (some files may be locked)"
                    Write-Host "This is usually safe to ignore - Next.js will handle it"
                }
            }
        }
    } catch {
        Write-Host "Warning: Clean failed, but continuing anyway"
    }
} else {
    Write-Host ".next directory does not exist, skipping clean"
}

