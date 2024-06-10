#!/bin/bash

export VIDEO_URL="$VIDEO_URL"

curl -o video.mp4 $VIDEO_URL

mkdir output

ffmpeg -i video.mp4 -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "output/segment%03d.ts" -start_number 0 output/index.m3u8

exec node script.js
