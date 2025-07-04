#!/bin/bash
URL="https://stg.bitnata.com"
if curl -sI $URL | grep "200"
then
  echo "[+] Staging environment is online deploying..."
  exit 0
else
  echo "[!] Staging environment is offline skipping..."
  exit 1
fi
