#!/bin/bash 

#IF YOU WANT TO USE ONE OF THEM (production), COMMENT OTHER (development).

# PRODUCTION
git checkout master
git reset --hard
git pull origin master
npm i
pm2 start ecosystem.config.js --env production

# DEVELOPMENT
# pm2 start ecosystem.config.js --env development

