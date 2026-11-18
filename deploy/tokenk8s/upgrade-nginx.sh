#!/usr/bin/env bash
set -euo pipefail

version=1.31.9-1~noble
signing_fingerprint=573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62
repo=/etc/apt/sources.list.d/nginx-mainline.list
pin=/etc/apt/preferences.d/nginx-mainline
keyring=/usr/share/keyrings/nginx-archive-keyring.gpg

test "$(id -u)" = 0
. /etc/os-release
test "$ID" = ubuntu
test "$VERSION_CODENAME" = noble
test "$(dpkg --print-architecture)" = amd64
test ! -e "$repo"
test ! -e "$pin"
test ! -e "$keyring"
test -z "$(find /etc/nginx/modules-enabled -type l -print -quit)"
nginx -t
systemctl is-active --quiet nginx

umask 077
backup=$(mktemp -d /opt/nginx-upgrade-backup.XXXXXXXX)
previous_version=$(dpkg-query -W nginx | awk '{print $2}')
tar -cpf "$backup/nginx-config.tar" -C / etc/nginx etc/default/nginx etc/logrotate.d/nginx
cp -p /usr/sbin/nginx "$backup/nginx.previous"
systemctl cat nginx > "$backup/nginx.service.previous"
nginx -T > "$backup/nginx.before.txt" 2>&1
find /etc/nginx -type f -exec sha256sum {} + > "$backup/config.before.sha256"
dpkg-query -W nginx nginx-common > "$backup/packages.before.txt"
cd "$backup"
apt-get download "nginx=$previous_version" "nginx-common=$previous_version"

install_started=false
complete=false
rollback() {
    result=$?
    trap - EXIT
    if "$complete"; then
        exit "$result"
    fi
    set +e
    if "$install_started"; then
        systemctl stop nginx
        mv /etc/nginx "$backup/nginx.failed"
        tar -xpf "$backup/nginx-config.tar" -C /
        DEBIAN_FRONTEND=noninteractive apt-get -y --allow-downgrades \
            -o Dpkg::Options::=--force-confold install \
            "$backup/nginx_${previous_version}_amd64.deb" \
            "$backup/nginx-common_${previous_version}_all.deb"
        systemctl daemon-reload
        nginx -t && systemctl restart nginx
    fi
    rm -f "$repo" "$pin" "$keyring"
    printf 'Upgrade failed. Recovery files are in %s\n' "$backup" >&2
    exit "$result"
}
trap rollback EXIT

curl -fsS --connect-timeout 10 --max-time 60 https://nginx.org/keys/nginx_signing.key -o signing.key
gpg --batch --dearmor --output nginx-archive-keyring.gpg signing.key
gpg --batch --show-keys --with-colons nginx-archive-keyring.gpg |
    awk -F: '$1 == "fpr" { print $10 }' | grep -Fx "$signing_fingerprint"
install -m 0644 nginx-archive-keyring.gpg "$keyring"
printf 'deb [signed-by=%s] https://nginx.org/packages/mainline/ubuntu noble nginx\n' "$keyring" > "$repo"
chmod 0644 "$repo"
printf 'Package: nginx nginx-module-*\nPin: origin nginx.org\nPin-Priority: 900\n' > "$pin"
chmod 0644 "$pin"
apt-get update > "$backup/apt-update.log" 2>&1
apt-cache policy nginx
apt-get -s install "nginx=$version" > "$backup/apt-plan.txt"
cat "$backup/apt-plan.txt"
if awk '$1 == "Remv" && $2 != "nginx-common" { found = 1 } END { exit !found }' "$backup/apt-plan.txt"; then
    printf 'The package plan removes additional packages. See %s\n' "$backup/apt-plan.txt" >&2
    exit 1
fi
apt-get download "nginx=$version"
deb="$backup/nginx_${version}_amd64.deb"
dpkg-deb -x "$deb" "$backup/candidate"
install -d -m 0755 /var/cache/nginx
"$backup/candidate/usr/sbin/nginx" -t -c /etc/nginx/nginx.conf -p /usr/share/nginx

install_started=true
DEBIAN_FRONTEND=noninteractive NEEDRESTART_MODE=l apt-get -y \
    -o Dpkg::Options::=--force-confold install "nginx=$version"
if [ -e /etc/nginx/conf.d/default.conf ]; then
    mv /etc/nginx/conf.d/default.conf "$backup/package-default.conf"
fi
tar -xpf "$backup/nginx-config.tar" -C /
sha256sum --check "$backup/config.before.sha256"
nginx -t
systemctl daemon-reload
systemctl restart nginx
systemctl is-active --quiet nginx
nginx -v 2>&1 | grep -Fx 'nginx version: nginx/1.31.9'
test "$(dpkg-query -W nginx | awk '{print $2}')" = "$version"
master_pid=$(systemctl show --property MainPID --value nginx)
test "$(readlink "/proc/$master_pid/exe")" = /usr/sbin/nginx
systemctl enable nginx
curl -fsS --max-time 10 --resolve tokenk8s.com:443:127.0.0.1 \
    https://tokenk8s.com/api/status | jq -e '.success == true' >/dev/null
complete=true
printf 'Nginx %s is active. Backup directory %s\n' "$version" "$backup"
