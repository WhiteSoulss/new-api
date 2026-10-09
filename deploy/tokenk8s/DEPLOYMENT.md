# TokenK8s production deployment

This directory records the non-secret deployment state currently running on
`101.47.18.106`.

## Production baseline

- Upstream source: `QuantumNous/new-api`
- Release: `v1.0.0-rc.36`
- Git revision: `ea7cb0ba4e0f82e2bfa5e55752eb68bdf902f71b`
- Container digest:
  `sha256:53ca9103fa06e803577e4557901d63ed4e2aa22c5fee0242172c7e35283ef49c`
- Application instances: `new-api-1` and `new-api-2`
- Data services: MySQL 8 and Redis 7
- Reverse proxy: Nginx

The checked-in Compose and Nginx files were copied from the production server
before the homepage deployment. They contain variable references but no secret
values.

## Deliberately excluded

- `.env` values
- API keys, provider credentials and SMTP credentials
- MySQL data files and SQL backups
- Redis data
- application logs
- TLS private keys and certificates
- user uploads and runtime state

Never commit those files. Start from `.env.example` when provisioning another
server.

## Required release flow

1. Make and test changes in this repository.
2. Commit and push the exact revision to GitHub.
3. Build and verify from that committed revision.
4. Deploy the committed revision with `deploy-homepage.sh`.
5. Verify the public page, API status and both container health checks.

The deployment script creates a versioned homepage release directory and
switches the `/var/www/guanqi-home` symlink atomically. The previous release
remains available for rollback.

## International homepage branding

The international homepage follows the domestic site's dark dataflow design,
but keeps the `tokenk8s.com` API and docs URLs, English-first copy, and the
models advertised by this deployment. `homepage/public/assets/parent-home.css`
styles the native New API header only while the custom homepage iframe is
present; Nginx injects that stylesheet into HTML responses.

The public `SystemName` and `Logo` options are recorded in `site-branding.sql.txt`.
Back up the current option rows before applying the SQL, then restart each app
instance in turn so its in-memory option map reloads. Neither credentials nor
database backups belong in Git.

## Public IP diagnostic entry

`nginx-ip.conf` adds HTTP and HTTPS routes for `101.47.18.106` without changing
the domain virtual hosts. It serves the existing `/var/www/guanqi-home` release directly, including
its local assets, so the initial homepage load does not depend on domain DNS or
the larger New API dashboard bundle. JavaScript and CSS compression is enabled
only for this additional entry. Its HTTPS route uses the existing domain
certificate, which does **not** cover the IP address and can trigger a browser
certificate-name warning. This is a routing fallback, not trusted IP-address
TLS. Do not bypass certificate validation for authenticated or API traffic.
Cached `/webmail/` redirects on the IP are sent back to the homepage; the mail
domain remains unchanged.

Only GET and HEAD requests are allowed. The public `/api/status` health endpoint
does not forward cookies or Authorization headers and does not return session
cookies. Login, console and other application routes redirect to the existing
HTTPS domain. Neither IP protocol is an authenticated or relay/API endpoint.
Its separate access log excludes query strings and credential headers.

After committing and pushing the exact revision to GitHub, install the tracked
file as `/etc/nginx/sites-available/tokenk8s-ip` and link it from
`/etc/nginx/sites-enabled/tokenk8s-ip`. Run `nginx -t` before a graceful reload;
do not change the existing domain or mail configuration.

Verify both IP routes and their JavaScript/CSS, confirm
compression, check `/api/status`, check that login redirects to HTTPS and POST
requests are rejected, and recheck the domain homepage and API. Check that the
old IP `/webmail/` path redirects locally to `/`. Report the IP certificate
limitation explicitly; a diagnostic TLS bypass does not prove trusted HTTPS.
Roll back by
unlinking only `/etc/nginx/sites-enabled/tokenk8s-ip` and reloading Nginx after a
successful syntax check.

Transport controls follow OWASP's
[Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#transmit-passwords-only-over-tls-or-other-strong-transport)
and
[Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#transport-layer-security).
This scoped transport change is not a claim of full application ASVS compliance.
