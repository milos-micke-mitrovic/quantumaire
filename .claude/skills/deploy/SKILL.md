---
name: deploy
description: Ship Quantumaire to production on Cloudflare Workers and verify it. Use after any change the user should see live.
---

# Deploy Quantumaire

1. `pkill -f "next dev"` (stray dev servers interfere with builds/tests).
2. `pnpm typecheck && pnpm lint && pnpm test` — must be clean.
3. `git add -A && git commit -m "<what changed>" && git push` (main).
   End commit messages with the Co-Authored-By line from the session.
4. `./deploy-cf.sh` (add `SKIP_CHECKS=1` only right after step 2 passed).
   It builds with OpenNext, deploys the `quantumaire` Worker, purges the
   Cloudflare cache and pings IndexNow.
5. Verify through Cloudflare directly (local DNS may be stale):
   `R=(--resolve quantumaire.space:443:104.21.50.132); curl -s -o /dev/null -w "%{http_code}\n" "${R[@]}" https://quantumaire.space/en`
   Spot-check the pages you changed and one unknown URL (must be 404).
6. Append a line to `docs/CHANGELOG-ai.md`.
