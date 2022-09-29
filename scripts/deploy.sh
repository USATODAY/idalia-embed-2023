#!/usr/bin/env sh

set -e

# staging or production?
DEPLOY_ENV="dev"
# deploy path, graphics or storytelling-embed
DEPLOY_PATH="storytelling-embed"

while [ "$1" != "" ]; do
	case $1 in
		--staging )
			shift
			DEPLOY_ENV="dev"
			;;

		--production )
			shift
			DEPLOY_ENV="master"
			;;
		* ) shift;;
	esac
done


echo "Deploying to $DEPLOY_ENV"

CDN_SPACE="gs://experiments-www-gannett-cdn-com/experiments/$DEPLOY_PATH/$DEPLOY_ENV"
PUBLIC_PATH="https://www.gannett-cdn.com/experiments/$DEPLOY_PATH/$DEPLOY_ENV"
CDN_PATH="https://$CDN_AUTH@www.gannett-cdn.com/experiments/$DEPLOY_PATH/$DEPLOY_ENV"
PROJECT_SLUG="$(basename $(pwd))"
PROJECT_FOLDER="./dist"
PUBLIC_URL="$PUBLIC_PATH/$PROJECT_SLUG/index.html"

gsutil -m rsync -r $PROJECT_FOLDER "$CDN_SPACE/$PROJECT_SLUG"
# Add AllUsers:R to the project folder
gsutil -m acl ch -u AllUsers:R  -r "$CDN_SPACE/$PROJECT_SLUG"

for filename in $(cd $PROJECT_FOLDER && find *); do
	echo "purging file: $PUBLIC_PATH/$PROJECT_SLUG/$filename"
	curl -X PURGE "$CDN_PATH/$PROJECT_SLUG/$filename"
done

wait
echo "Deployed to:"
echo $PUBLIC_URL
