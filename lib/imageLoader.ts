/**
 * Custom next/image loader for Cloudflare Workers, which have no built-in
 * image optimizer. Stop images under /images/ have pre-generated width
 * variants (scripts/resize-images.mjs); pick the smallest one that covers
 * the requested width, or the original when none does.
 */

// Keep in sync with WIDTHS in scripts/resize-images.mjs.
export const IMAGE_WIDTHS = [128, 384, 640, 828, 1080] as const;

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const match = /^\/images\/([^/]+\.webp)$/.exec(src);
  if (!match) return src;
  const bucket = IMAGE_WIDTHS.find((w) => w >= width);
  return bucket ? `/images/w${bucket}/${match[1]}` : src;
}
