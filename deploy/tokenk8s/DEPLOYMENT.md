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

