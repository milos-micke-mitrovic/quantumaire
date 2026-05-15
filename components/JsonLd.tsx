interface JsonLdProps {
  data: object | object[];
}

/**
 * Embed structured data as a `<script type="application/ld+json">`.
 * Safe for server components — no client JS.
 */
export function JsonLd({ data }: JsonLdProps) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
