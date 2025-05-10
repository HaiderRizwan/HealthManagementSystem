@echo off
rmdir /s /q node_modules
del /f /q package-lock.json
call npm cache clean --force
call npm install
call npm start 