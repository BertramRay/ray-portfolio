import Link from "next/link";

// Placeholder blog post page — MDX integration can be added later
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-accent-amber hover:text-accent-red transition-colors"
          >
            Ray
          </Link>
          <span className="mx-3 text-muted">/</span>
          <Link
            href="/blog"
            className="font-mono text-sm text-muted hover:text-accent-amber transition-colors"
          >
            Blog
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <article className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">
            {slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")}
          </h1>
          <p className="text-muted text-lg">
            This blog post is coming soon. Stay tuned!
          </p>
        </article>

        <Link
          href="/blog"
          className="inline-block mt-12 text-sm font-mono text-accent-amber hover:text-accent-red transition-colors"
        >
          ← Back to all posts
        </Link>
      </main>
    </div>
  );
}
