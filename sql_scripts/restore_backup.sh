!/bin/bash                                                                     
                                                                                
source .env                                                                     
                                                                                
curl https://$GITHUB_PAT@raw.githubusercontent.com/lexesjan/aniskip-database-backup/main/db.dump | docker exec -i aniskip_db_1 psql -v ON_ERROR_STOP=1 -U postgres db