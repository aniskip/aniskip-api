$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition

& docker-compose -f $scriptDir/docker-compose.yml -f $scriptDir/docker-compose.dev.yml up --build -d