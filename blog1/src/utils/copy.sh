#!/bin/sh
cd /Users/tangjingcheng/Desktop/Github/learnNodeByVideo/blog1/logs
cp access.log $(date +%Y-%m-%d).access.log
echo '' > access.log