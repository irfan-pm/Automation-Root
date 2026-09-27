@echo off
title MMG website - local server
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
