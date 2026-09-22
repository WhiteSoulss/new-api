#!/usr/bin/env bash
set -euo pipefail

repo_root=$(git rev-parse --show-toplevel)
homepage_dir="$repo_root/deploy/tokenk8s/homepage"
deploy_host=${TOKENK8S_DEPLOY_HOST:-root@101.47.18.106}
commit=$(git -C "$repo_root" rev-parse --verify HEAD)
release="git-${commit:0:12}"
remote_release="/var/www/guanqi-home-releases/$release"
archive=$(mktemp "/tmp/tokenk8s-homepage.${release}.XXXXXX.tgz")

cleanup() {
  rm -f "$archive"
}
trap cleanup EXIT

if [[ -n $(git -C "$repo_root" status --porcelain) ]]; then
  echo "Refusing to deploy an uncommitted working tree." >&2
  exit 1
fi

published=$(git -C "$repo_root" ls-remote --exit-code origin refs/heads/tokenk8s-production | awk '{print $1}')
if [[ "$commit" != "$published" ]]; then
  echo "Refusing to deploy: push this exact revision to GitHub first." >&2
  exit 1
fi

npm --prefix "$homepage_dir" ci
npm --prefix "$homepage_dir" run build
npm --prefix "$homepage_dir" run test:sites

tar -C "$homepage_dir/dist/client" -czf "$archive" .
ssh "$deploy_host" "install -d -m 755 '$remote_release'"
scp "$archive" "$deploy_host:/tmp/tokenk8s-homepage-release.tgz"
ssh "$deploy_host" "
  set -eu
  tar -xzf /tmp/tokenk8s-homepage-release.tgz -C '$remote_release'
  rm -f /tmp/tokenk8s-homepage-release.tgz
  test -f '$remote_release/index.html'
  ln -sfn '$remote_release' /var/www/guanqi-home.next
  mv -Tf /var/www/guanqi-home.next /var/www/guanqi-home
  nginx -t
  systemctl reload nginx
"

curl --fail --silent --show-error "https://tokenk8s.com/guanqi-home-v2/index.html" >/dev/null
curl --fail --silent --show-error "https://tokenk8s.com/api/status" >/dev/null
echo "Deployed homepage revision $commit to $deploy_host"
