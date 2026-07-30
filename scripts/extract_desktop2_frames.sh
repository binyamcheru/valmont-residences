#!/bin/bash
# ==============================================================================
# Script: extract_desktop2_frames.sh
# Description: Converts 3 consecutive 8-second MP4 videos into a 360-frame
#              WebP sequence (120 frames each) for public/frames/desktop2/
# ==============================================================================

# Input Video Paths (Pass as arguments or customize defaults below)
VIDEO1="${1:-video1.mp4}"
VIDEO2="${2:-video2.mp4}"
VIDEO3="${3:-video3.mp4}"

OUTPUT_DIR="public/frames/desktop2"

echo "======================================================="
echo "  The Belmoor - 360 Frame Extraction Pipeline (desktop2) "
echo "======================================================="
echo "Input 1 : $VIDEO1"
echo "Input 2 : $VIDEO2"
echo "Input 3 : $VIDEO3"
echo "Target  : $OUTPUT_DIR"
echo "======================================================="

# Verify input files exist
for v in "$VIDEO1" "$VIDEO2" "$VIDEO3"; do
  if [ ! -f "$v" ]; then
    echo "❌ Error: Video file '$v' not found!"
    echo "Usage: ./scripts/extract_desktop2_frames.sh <video1.mp4> <video2.mp4> <video3.mp4>"
    exit 1
  fi
done

# Ensure destination directory exists
mkdir -p "$OUTPUT_DIR"

echo ""
echo "⏳ [1/3] Extracting Part 1 (Frames 0001 - 0120)..."
ffmpeg -i "$VIDEO1" \
  -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -frames:v 120 \
  -vcodec libwebp \
  -f image2 \
  -q:v 75 \
  -an \
  "$OUTPUT_DIR/frame_%04d.webp" \
  -y -loglevel error

if [ $? -eq 0 ]; then
  echo "✅ Part 1 complete (Frames 1-120)."
else
  echo "❌ Error processing Part 1"
  exit 1
fi

echo ""
echo "⏳ [2/3] Extracting Part 2 (Frames 0121 - 0240)..."
ffmpeg -i "$VIDEO2" \
  -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -frames:v 120 \
  -start_number 121 \
  -vcodec libwebp \
  -f image2 \
  -q:v 75 \
  -an \
  "$OUTPUT_DIR/frame_%04d.webp" \
  -y -loglevel error

if [ $? -eq 0 ]; then
  echo "✅ Part 2 complete (Frames 121-240)."
else
  echo "❌ Error processing Part 2"
  exit 1
fi

echo ""
echo "⏳ [3/3] Extracting Part 3 (Frames 0241 - 0360)..."
ffmpeg -i "$VIDEO3" \
  -vf "fps=15,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
  -frames:v 120 \
  -start_number 241 \
  -vcodec libwebp \
  -f image2 \
  -q:v 75 \
  -an \
  "$OUTPUT_DIR/frame_%04d.webp" \
  -y -loglevel error

if [ $? -eq 0 ]; then
  echo "✅ Part 3 complete (Frames 241-360)."
else
  echo "❌ Error processing Part 3"
  exit 1
fi

echo ""
echo "======================================================="
echo "🎉 SUCCESS: All 360 frames extracted to $OUTPUT_DIR!"
echo "Total frames: $(ls -1 "$OUTPUT_DIR"/*.webp 2>/dev/null | wc -l)"
echo "Total folder size: $(du -sh "$OUTPUT_DIR" | cut -f1)"
echo "======================================================="
