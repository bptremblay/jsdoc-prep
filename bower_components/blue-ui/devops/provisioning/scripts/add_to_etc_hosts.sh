#!/bin/bash

set -e

for arg in "$@"; do
  items=($arg)
  addr=${items[0]}
  name=${items[1]}

  set +e
  /usr/bin/getent hosts $name > /dev/null 2>&1
  result=$?
  set -e

  if [ $result -ne 0 ]; then
    /bin/echo "$addr $name" >> /etc/hosts 
  fi
done
