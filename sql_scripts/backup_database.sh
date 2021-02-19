#!/bin/bash

cd "${BASH_SOURCE%/*}"

cd ../docker
docker-compose exec db pg_dump -U postgres --table=skip_times --data-only db > ../sql_scripts/opening-skipper-database-backup/db.dump

cd ../sql_scripts/opening-skipper-database-backup
git commit -am "Update database backup"
git push