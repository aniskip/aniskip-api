#!/bin/bash

main () {
  if [ "$#" -ne 1 ] || [ "$1" != "prod" ] && [ "$1" != "prod-local" ] && [ "$1" != "dev" ] && [ "$1" != "test" ]; then
    echo "Usage: $0 TYPE"
    echo "Start the aniskip api using docker"
    echo
    echo "TYPE: the startup type"
    echo "  prod: deploying for production"
    echo "  prod-local: start production build locally"
    echo "  dev: start development build"
    echo "  test: run tests"
    return 1
  fi

  # ensure script can be ran anywhere
  cd "${BASH_SOURCE%/*}"

  case $1 in
    "prod")
      docker-compose up --build -d
      ;;
    "prod-local")
      docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml up --build -d
      ;;
    "dev")
      docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml -f ./docker-compose.dev.yml up --build -d
      ;;
    "test")
      docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml -f ./docker-compose.test.yml up --build --abort-on-container-exit --exit-code-from api
      docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml -f ./docker-compose.test.yml rm --force -v test_db
      ;;
  esac
}

main "$@"