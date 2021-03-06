date > ./last_backup.txt &&\
 rsync -rtK --delete --exclude .next --exclude node_modules . /home/backup &&\
  cat ./last_backup.txt