#!/bin/sh
#/etc/init.d/gardenCollector.sh
export PATH=$PATH:/usr/local/bin
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

case "$1" in
start)
exec forever --sourceDir=/home/pi/Projects/GardenCollector -p /home/pi/Projects/GardenCollector app.js
;;
stop)
exec forever stop --sourceDir=/home/pi/Projects/GardenCollector app.js
;;
*)
echo "Usage: /etc/init.d/gardenCollector.sh {start|stop}"
exit 1
;;
esac
exit 0
