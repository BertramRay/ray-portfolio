import Link from "next/link";

const BLOG_POSTS = [
  {
    title: "Building LLM-Powered Data Pipelines",
    description:
      "How we integrated large language models into our data processing pipeline for automated creator quality analysis.",
    date: "2024-12-15",
    slug: "llm-data-pipelines",
  },
  {
    title: "Prompt Engineering at Scale",
    description:
      "Lessons learned from building a prompt evaluation platform and iterating on prompts across thousands of evaluations.",
    date: "2024-11-20",
    slug: "prompt-engineering-at-scale",
  },
  {
    title: "Creative Coding with GLSL Shaders",
    description:
      "An introduction to fragment shaders and how I built the fluid gradient background for this portfolio.",
    date: "2024-10-05",
    slug: "glsl-shaders-intro",
  },
];

export default function BlogPage() {
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
          <span className="font-mono text-sm text-muted">Blog</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-12">Blog</h1>
        <div className="space-y-8">
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="border-b border-border pb-8">
                <time className="text-xs font-mono text-muted">
                  {post.date}
                </time>
                <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-accent-amber transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted">{post.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
