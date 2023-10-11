#!/bin/bash
# Version 2
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

#
# Functions
#

downloadRepository() {
	echo "$S Download repository"	
	if [ ! -d "${PATH_TO_DIRECTORY}" ]
	then 
		echo "$I -> Downloading repository"
		`cd ${PATH_TO_DOWNLOAD_DIRECTORY} && git clone ${GITHUB_SSH_URL}`
	else
		echo "$I -> Pulling repository"
		`cd ${PATH_TO_DIRECTORY} && git reset --hard HEAD`
		`cd ${PATH_TO_DIRECTORY} && git clean -xffd`
		`cd ${PATH_TO_DIRECTORY} && git pull`
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
}

restartService(){
	echo "$S Restart Service"
	`sudo systemctl daemon-reload`
	`sudo systemctl restart Afoodable.service` 
}

ngDisableAnalytics() {
	echo "$S Disabling angular analytics"
	`cd ${PATH_TO_CLIENT_DIRECTORY} && ng analytics off`
}

npmInstall() {
	echo "$S NPM Install"
	cd ${PATH_TO_CLIENT_DIRECTORY} && npm install
}

ngBuild() {
	echo "$S Angular build"
	cd ${PATH_TO_CLIENT_DIRECTORY} && ng build -c prod --base-href afoodable
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
# Implementation
#
echo "$B Launching Afoodable Initial setup"

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