
 cd  /var/www/AssetHomezWeb/

#    git stash
    # to stash package-lock.json file changes

 #   git pull
  #  git checkout master
   # git pull origin master

    echo 'Going to build frontend'

export NODE_ENV=production

   yarn build

  echo 'Sh job completed'
    #rm -rf node_modules/


   # pm2 restart 4

    exit





