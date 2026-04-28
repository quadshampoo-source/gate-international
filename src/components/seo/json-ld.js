// Reusable JSON-LD injector. Server-component-safe — emits the canonical
// `<script type="application/ld+json">…` tag Google uses for rich results,
// knowledge panel, breadcrumb display and sales card. Multiple instances
// can co-exist on a page (e.g. Organization + WebSite + BreadcrumbList).
//
// Usage:
//   <JsonLd data={organizationSchema()} />
//
// data is serialised at render time via JSON.stringify; nest as deep as
// you need. Crawlers ignore HTML escaping inside the tag, so no extra
// escaping is required for the schema string contents.
export default function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
