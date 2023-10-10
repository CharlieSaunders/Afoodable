#!/bin/bash
# Version 1
#
# Variables
#
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/pi/.dotnet:/home/pi/.dotnet/tools:/home/pi/.dotnet:/home/pi/.dotnet/tools
B="\033[0;35m[BEGIN]\033[1;37m:"
E="\033[0;31m[ERROR]\033[1;37m:"
S="\033[0;32m[STEP]\033[1;37m: "
I="\033[0;34m[INFO]\033[1;37m: "


PATH_TO_DOWNLOAD_DIRECTORY=/var/www/html/build
PATH_TO_NGINX=/var/www/html
PATH_TO_NGINX_SERVER=/var/www/html/afoodable-server
PATH_TO_NGINX_CLIENT=/var/www/html/afoodable
PATH_TO_SERVICE_DIRECTORY=/etc/systemd/system/

PATH_TO_DIRECTORY="${PATH_TO_DOWNLOAD_DIRECTORY}/Afoodable"
PATH_TO_CLIENT_DIRECTORY="${PATH_TO_DIRECTORY}/Client"
PATH_TO_SERVER_DIRECTORY="${PATH_TO_DIRECTORY}/Server"

GITHUB_SSH_URL="https://github.com/CharlieSaunders/Afoodable.git"

REPOSITORY_UP_TO_DATE=true
REPOSITORY_FOLDER_FOUND=true
REPOSITORY_BRANCH_UP_TO_DATE=true

CLIENT_FILE_CHANGED=false
SERVER_FILE_CHANGED=false

#
# Functions
#

downloadRepository() {
	echo "$S Updating repository"	

	if [ $REPOSITORY_FOLDER_FOUND = false ]
	then
		`cd ${PATH_TO_DOWNLOAD_DIRECTORY} && git clone ${GITHUB_SSH_URL}`
	else
		echo "$I -> Skip downloading git repo. Already downloaded"
	fi
	
	if [ ! -d "${PATH_TO_DIRECTORY}" ]
	then 
		echo "$E Repository not found after downloading"
		exit
	fi
}

checkRepositoryIsLatest() {	
	echo "$S Checking status of current repository"
	
	if [ -d "${PATH_TO_DIRECTORY}" ]
	then
		echo "$I -> Current repository found"
		gitRestore=`cd ${PATH_TO_DIRECTORY} && git restore .`
		gitUpdate=`cd ${PATH_TO_DIRECTORY} && git remote update`
		gitStatus=$(cd ${PATH_TO_DIRECTORY} && git status -uno | grep -i "branch is up to date")
		if [ "$gitStatus" = "Your branch is up to date with 'origin/main'." ]
		then
			echo "$I -> Branch up to date with main"
		else
			echo "$I -> Branch not up to date with main"
			REPOSITORY_BRANCH_UP_TO_DATE=false
			gitPull=`cd ${PATH_TO_DIRECTORY} && git pull`
		fi
	else
		echo "$I -> Current repository not found"
		REPOSITORY_FOLDER_FOUND=false
		`sudo rm -R ${PATH_TO_DIRECTORY}`
	fi

}

setDownloadsFoldersPermissions() {
	echo "$S Setting permissions of downloaded folders"
	`sudo chmod -R 777 ${PATH_TO_DIRECTORY}`
}

deleteFolders() {
	echo "$S Deleting current folders"
	`sudo rm -R ${PATH_TO_DOWNLOAD_DIRECTORY}/.goutputstream-* -v`
}

setRepositoryPermissions() {
	echo "$S Setting permissions on directory"
	`sudo chmod -R 777 /var/www/html/`
	`sudo chmod -R 777 ${PATH_TO_NGINX_SERVER}`
	`sudo chmod -R 777 ${PATH_TO_NGINX_CLIENT}`
	`sudo chmod -R 777 ${PATH_TO_NGINX_SERVICE_CLIENT}`
}

restartService(){
	echo "$S Restart Service"
	`sudo systemctl restart Afoodable.service` 
}

ngDisableAnalytics() {
	echo "$S Disabling angular analytics"
	`cd ${PATH_TO_CLIENT_DIRECTORY} && ng analytics off`
}

npmInstall() {
	echo "$S NPM Install"
	if [ -d "${PATH_TO_CLIENT_DIRECTORY}/node_modules" ] && [ $CLIENT_FILE_CHANGED = false ]
	then
		echo "$I Skipping NPM install as node_modules found and no client files changed"
	else
		cd ${PATH_TO_CLIENT_DIRECTORY} && npm install
	fi
}

ngBuild() {
	echo "$S Angular build"
	if [ -f "${PATH_TO_CLIENT_DIRECTORY}/dist/index.html" ] && [ $CLIENT_FILE_CHANGED = false ]
	then
		echo "$I Skipping NG build as dist found and no client files changed"
	else
		cd ${PATH_TO_CLIENT_DIRECTORY} && ng build -c prod --base-href afoodable
	fi
	
}

ngCopy() {
	echo "$S Angular Copy"
	`sudo cp -r ${PATH_TO_CLIENT_DIRECTORY}/dist/* ${PATH_TO_NGINX_CLIENT}`
}

copyNginxConfigs(){
	echo "$S Skipping NGINX Config changes. Please remember to add a proxy to this website"
    echo "$S Copying Service"
    `sudo cp -r ${PATH_TO_DIRECTORY}/Afoodable.service ${PATH_TO_SERVICE_DIRECTORY}/Afoodable.service`
    `sudo systemctl daemon-reload`
    `sudo systemctl restart Afoodable.service`
}


#
# Helper Functions
#
stringContains() {
	[ -z "$1" ] || { [ -z "${2##*$1*}" ] && [ -n "$2" ];};
}

#
# Implementation
#
echo "$B Launching Afoodable Initial setup"

checkRepositoryIsLatest
downloadRepository
setDownloadsFoldersPermissions

ngDisableAnalytics
npmInstall
ngBuild

deleteFolders

ngCopy

copyNginxConfigs

setRepositoryPermissions
restartService