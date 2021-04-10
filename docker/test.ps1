$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition

& docker-compose -f $scriptDir/docker-compose.yml -f $scriptDir/docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api --renew-anon-volumes