import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// The site is fully prerendered (no ISR/revalidation), so prerendered HTML is
// served straight from Workers static assets instead of being re-rendered.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
