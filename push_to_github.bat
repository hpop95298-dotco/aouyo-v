@echo off
cd /d "%~dp0"
echo Pushing project files to GitHub...
git remote set-url origin https://github.com/hpop95298-dotco/aouyo-v.git
git push https://github.com/hpop95298-dotco/aouyo-v.git main --force
echo Done!
pause


