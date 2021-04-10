$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition

& docker-compose -f $scriptDir/docker-compose.yml -f $scriptDir/docker-compose.prod.yml up --build -d