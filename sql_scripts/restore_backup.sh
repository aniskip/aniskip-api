!/bin/bash                                                                     
                                                                                
cd "${BASH_SOURCE%/*}"

source .env                                                                     
                                                                                
docker exec aniskip_db_1 psql -U postgres -d db -c 'TRUNCATE skip_times'
curl https://$GITHUB_PAT@raw.githubusercontent.com/lexesjan/aniskip-database-backup/main/db.dump | docker exec -i aniskip_db_1 psql -v ON_ERROR_STOP=1 -U postgres db