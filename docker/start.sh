#!/bin/bash

main () {
  if [ "$#" -ne 1 ] || [ "$1" != "prod" ] && [ "$1" != "prod-local" ]; then
    echo "Usage: $0 TYPE"
    echo "Start the aniskip api using docker"
    echo
    echo "TYPE: the startup type"
    echo "  prod: deploying for production"
    echo "  prod-local: start production build locally"
    return 1
  fi

  # ensure script can be ran anywhere
  cd "${BASH_SOURCE%/*}"

  case $1 in
    # --wait fails (and so fails the deploy) unless every service becomes
    # healthy, e.g. the API can't reach Postgres or a migration fails.
    "prod")
      docker compose up -d --wait --wait-timeout 120
      ;;
    "prod-local")
      docker compose -f ./docker-compose.yml -f ./docker-compose.build.yml up --build -d --wait --wait-timeout 120
      ;;
  esac
}

main "$@"
