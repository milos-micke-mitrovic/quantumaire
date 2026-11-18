#!/usr/bin/env bash
#
# Deploy Quantumaire to Cloudflare Workers (OpenNext) → https://quantumaire.space
# Replaces the Vercel git-push deploy.
#
# Usage:  ./deploy-cf.sh   (or: pnpm deploy:cf)
# Auth:   $CLOUDFLARE_API_TOKEN, or ~/.jamogu-cf-token (shared account token).
#
set -euo pipefail
cd "$(dirname "$0")"

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] && [ -f "$HOME/.jamogu-cf-token" ]; then
  export CLOUDFLARE_API_TOKEN="$(cat "$HOME/.jamogu-cf-token")"
fi
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "✗ No Cloudflare API token. Set CLOUDFLARE_API_TOKEN or create ~/.jamogu-cf-token" >&2
  exit 1
fi

# Public, build-time values (baked into the HTML; previously Vercel env vars).
export NEXT_PUBLIC_SITE_URL="https://quantumaire.space"
export NEXT_PUBLIC_GA_MEASUREMENT_ID="G-4K9LS63Z4C"
export NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION="AS2fSKQwj1YPm8x8H1FsIy0rRSQDHOHb22qv0GRLMbI"

if [ "${SKIP_CHECKS:-0}" != "1" ]; then
  echo "▸ Typecheck, lint, tests…"
  pnpm -s typecheck
  pnpm -s lint
  pnpm -s test
fi

echo "▸ Building for Cloudflare…"
npx opennextjs-cloudflare build

echo "▸ Deploying…"
npx opennextjs-cloudflare deploy

# OpenNext serves prerendered pages with a 1-year edge cache, so purge after
# every deploy or the custom domain keeps serving the previous build.
echo "▸ Purging edge cache…"
ZONE_ID=$(curl -s "https://api.cloudflare.com/client/v4/zones?name=quantumaire.space" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | sed -n 's/.*"result":\[{"id":"\([a-f0-9]*\)".*/\1/p')
if [ -z "$ZONE_ID" ]; then
  echo "  ⚠ Zone quantumaire.space not found on this account — skipping purge."
else
  purge=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')
  if echo "$purge" | grep -q '"success":true'; then echo "  ✓ Cache purged"
  else echo "  ⚠ Cache purge failed (deploy still succeeded): $purge" >&2; fi
fi

# Tell Bing/Yandex/Naver (IndexNow) that pages changed.
curl -s -o /dev/null -X POST https://quantumaire.space/api/indexnow || true

echo "✓ Deployed → https://quantumaire.space"
