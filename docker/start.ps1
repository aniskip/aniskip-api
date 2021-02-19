$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition

& docker-compose -f $scriptDir/docker-compose.yml up --build -d