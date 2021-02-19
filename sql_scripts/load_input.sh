#!/bin/bash

set -e

psql -v ON_ERROR_STOP=1 -U postgres db < /docker-entrypoint-initdb.d/db.dump