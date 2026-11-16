#!/usr/bin/env bash
set -Eeuo pipefail

# Prepare the known Hong Kong origin from the private rehearsal copy.
# No service is exposed and no DNS is changed by this script.
stage=${1:?provide the rehearsal directory}
[[ $stage =~ ^/opt/tokenk8s-migration/rehearsal\.[A-Za-z0-9]+$ ]]
[[ $(hostname) == iv-yezmw80hdsnic5ccy7um ]]
rootfs=$stage/rootfs
umask 077

if [[ ${2:-} == --resume-after-copy ]]; then
  cmp -s "$rootfs/opt/new-api/.env" /opt/new-api/.env
  cmp -s "$rootfs/opt/new-api/docker-compose.yml" /opt/new-api/docker-compose.yml
  cmp -s "$rootfs/opt/mailu/docker-compose.yml" /opt/mailu/docker-compose.yml
  cmp -s "$rootfs/etc/letsencrypt/renewal/tokenk8s.com.conf" /etc/letsencrypt/renewal/tokenk8s.com.conf
else
  for path in /opt/new-api /opt/mailu /var/www/guanqi-home /var/www/guanqi-docs; do
    [[ ! -e $path && ! -L $path ]]
  done
  test ! -e /etc/letsencrypt/live/tokenk8s.com
fi
for path in /etc/nginx/sites-enabled/tokenk8s /etc/nginx/sites-enabled/tokenk8s-ip; do
  [[ ! -e $path && ! -L $path ]]
done
if systemctl is-active --quiet nginx; then
  echo "Refusing to change a running Nginx instance" >&2
  exit 1
fi
test -f "$rootfs/opt/new-api/.env"
test -f "$rootfs/opt/mailu/docker-compose.yml"
test -f "$rootfs/etc/letsencrypt/renewal/tokenk8s.com.conf"

install -d -m 700 /opt/new-api /opt/mailu "$stage/target-defaults"
install -m 600 "$rootfs/opt/new-api/.env" /opt/new-api/.env
install -m 644 "$rootfs/opt/new-api/docker-compose.yml" /opt/new-api/docker-compose.yml
rsync -a "$rootfs/opt/new-api/data" "$rootfs/opt/new-api/logs" /opt/new-api/
rsync -a "$rootfs/opt/mailu/" /opt/mailu/
rsync -a "$rootfs/etc/letsencrypt/" /etc/letsencrypt/
rsync -a "$rootfs/var/www/" /var/www/
install -d -m 755 /var/www/letsencrypt/.well-known/acme-challenge

install -m 644 "$rootfs/etc/nginx/conf.d/new-api-upstream.conf" /etc/nginx/conf.d/new-api-upstream.conf
install -m 644 "$rootfs/etc/nginx/sites-available/tokenk8s" /etc/nginx/sites-available/tokenk8s
install -m 644 "$rootfs/etc/nginx/sites-available/mail.tokenk8s.com" /etc/nginx/sites-available/mail.tokenk8s.com
# Produce the IP vhost from the versioned source configuration.
sed 's/^    server_name 101\.47\.18\.106;$/    server_name 150.5.134.20;/' "$rootfs/etc/nginx/sites-available/tokenk8s-ip" > "$stage/artifacts/nginx-ip-hk.conf"
grep -Fq 'server_name 150.5.134.20;' "$stage/artifacts/nginx-ip-hk.conf"
install -m 644 "$stage/artifacts/nginx-ip-hk.conf" /etc/nginx/sites-available/tokenk8s-ip
if [[ -L /etc/nginx/sites-enabled/default ]]; then
  mv /etc/nginx/sites-enabled/default "$stage/target-defaults/nginx-default"
fi
ln -s /etc/nginx/sites-available/tokenk8s /etc/nginx/sites-enabled/tokenk8s
ln -s /etc/nginx/sites-available/tokenk8s-ip /etc/nginx/sites-enabled/tokenk8s-ip
# Mail is switched separately: preserve its vhost but leave it disabled.
systemctl disable --now certbot.timer
install -m 700 "$rootfs/usr/local/sbin/new-api-db-backup" /usr/local/sbin/new-api-db-backup
for unit in new-api-db-backup.service new-api-db-backup.timer; do
  install -m 644 "$rootfs/etc/systemd/system/$unit" "/etc/systemd/system/$unit"
done
systemctl daemon-reload
nginx -t
(cd /opt/new-api && docker compose config --quiet)
(cd /opt/mailu && docker compose config --quiet)
test -s /var/www/guanqi-home/index.html
test -s /var/www/guanqi-docs/index.html
echo "Hong Kong production paths prepared; web and mail services remain offline"
