# ==============================================================================
# Script: extract_desktop2_frames.ps1
# Description: Converts 3 consecutive 8-second MP4 videos into a 360-frame
#              WebP sequence (120 frames each) for public/frames/desktop2/
# ==============================================================================

param (
    [string]$Video1 = "video1.mp4",
    [string]$Video2 = "video2.mp4",
    [string]$Video3 = "video3.mp4"
)

$OutputDir = "public\frames\desktop2"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "  The Belmoor - 360 Frame Extraction Pipeline (desktop2)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Input 1 : $Video1"
Write-Host "Input 2 : $Video2"
Write-Host "Input 3 : $Video3"
Write-Host "Target  : $OutputDir"
Write-Host "======================================================="

# Verify input files exist
foreach ($v in @($Video1, $Video2, $Video3)) {
    if (-not (Test-Path $v)) {
        Write-Host "❌ Error: Video file '$v' not found!" -ForegroundColor Red
        Write-Host "Usage: .\scripts\extract_desktop2_frames.ps1 -Video1 part1.mp4 -Video2 part2.mp4 -Video3 part3.mp4" -ForegroundColor Yellow
        exit 1
    }
}

# Ensure destination directory exists
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

Write-Host "`n⏳ [1/3] Extracting Part 1 (Frames 0001 - 0120)..." -ForegroundColor Yellow
& ffmpeg -i $Video1 -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -frames:v 120 -vcodec libwebp -f image2 -q:v 75 -an "$OutputDir\frame_%04d.webp" -y -loglevel error
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Part 1 complete (Frames 1-120)." -ForegroundColor Green
} else {
    Write-Host "❌ Error processing Part 1" -ForegroundColor Red
    exit 1
}

Write-Host "`n⏳ [2/3] Extracting Part 2 (Frames 0121 - 0240)..." -ForegroundColor Yellow
& ffmpeg -i $Video2 -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -frames:v 120 -start_number 121 -vcodec libwebp -f image2 -q:v 75 -an "$OutputDir\frame_%04d.webp" -y -loglevel error
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Part 2 complete (Frames 121-240)." -ForegroundColor Green
} else {
    Write-Host "❌ Error processing Part 2" -ForegroundColor Red
    exit 1
}

Write-Host "`n⏳ [3/3] Extracting Part 3 (Frames 0241 - 0360)..." -ForegroundColor Yellow
& ffmpeg -i $Video3 -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -frames:v 120 -start_number 241 -vcodec libwebp -f image2 -q:v 75 -an "$OutputDir\frame_%04d.webp" -y -loglevel error
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Part 3 complete (Frames 241-360)." -ForegroundColor Green
} else {
    Write-Host "❌ Error processing Part 3" -ForegroundColor Red
    exit 1
}

$files = Get-ChildItem $OutputDir -Filter *.webp
$totalMb = [math]::Round(($files | Measure-Object -Property Length -Sum).Sum / 1MB, 2)

Write-Host "`n=======================================================" -ForegroundColor Cyan
Write-Host "🎉 SUCCESS: All $($files.Count) frames extracted to $OutputDir!" -ForegroundColor Green
Write-Host "Total folder size: $totalMb MB" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
