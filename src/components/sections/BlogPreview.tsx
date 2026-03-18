"use client";

import { motion } from "framer-motion";
import SectionWrapper from "@/components/layout/SectionWrapper";

const PREVIEW_POSTS = [
  {
    title: "Building LLM-Powered Data Pipelines",
    description:
      "How we integrated large language models into our data processing pipeline for automated creator quality analysis.",
    date: "2024-12-15",
    slug: "llm-data-pipelines",
    size: "4.2K",
  },
  {
    title: "Prompt Engineering at Scale",
    description:
      "Lessons learned from building a prompt evaluation platform and iterating on prompts across thousands of evaluations.",
    date: "2024-11-20",
    slug: "prompt-engineering-at-scale",
    size: "3.8K",
  },
  {
    title: "Creative Coding with GLSL Shaders",
    description:
      "An introduction to fragment shaders and how I built the fluid gradient background for this portfolio.",
    date: "2024-10-05",
    slug: "glsl-shaders-intro",
    size: "5.1K",
  },
];

export default function BlogPreview() {
  return (
    <SectionWrapper id="blog" transition="expand">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <span className="eyebrow">Writing</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 leading-tight">
            Latest{" "}
            <span className="font-serif-display italic text-stroke">Posts</span>
          </h2>
        </div>
        <a
          href="/blog"
          className="link-animated text-sm font-mono text-muted/50 hover:text-accent-amber transition-colors duration-300 hidden sm:block"
        >
          View all →
        </a>
      </div>

      {/* Terminal-style blog listing */}
      <div className="rounded-xl bg-card-bg border border-border overflow-hidden">
        {/* Terminal bar */}
        <div className="h-8 bg-border/20 flex items-center px-4 gap-2">
          <div className="w-2 h-2 rounded-full bg-accent-red/30" />
          <div className="w-2 h-2 rounded-full bg-accent-amber/30" />
          <div className="w-2 h-2 rounded-full bg-green-500/25" />
          <span className="ml-3 text-[10px] font-mono text-muted/30">
            ~/blog
          </span>
        </div>

        <div className="p-5 md:p-6 font-mono text-sm">
          {/* Command */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-accent-amber/60">$</span>
            <span className="text-muted/60">ls -la posts/</span>
          </motion.div>

          {/* Header row */}
          <div className="text-[11px] text-muted/30 mb-2 hidden md:flex items-center gap-4 px-1">
            <span className="w-16">size</span>
            <span className="w-20">date</span>
            <span className="flex-1">title</span>
          </div>

          {/* File entries */}
          <div className="space-y-1">
            {PREVIEW_POSTS.map((post, i) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="group flex flex-col md:flex-row md:items-center gap-1 md:gap-4 px-2 py-2.5 rounded-lg hover:bg-accent-amber/5 transition-colors cursor-pointer"
              >
                <span className="text-[11px] text-muted/30 w-16 shrink-0 hidden md:block">
                  {post.size}
                </span>
                <span className="text-[11px] text-muted/30 w-20 shrink-0">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-foreground/70 group-hover:text-accent-amber transition-colors truncate block">
                    {post.title}
                  </span>
                  <span className="text-[11px] text-muted/30 line-clamp-1 mt-0.5 md:hidden">
                    {post.description}
                  </span>
                </div>
                <span className="text-accent-amber/0 group-hover:text-accent-amber/50 transition-colors text-xs shrink-0 hidden md:block">
                  →
                </span>
              </motion.a>
            ))}
          </div>

          {/* Summary line */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-4 pt-3 border-t border-border/50 text-[11px] text-muted/25"
          >
            3 posts, 13.1K total
          </motion.div>
        </div>
      </div>

      <div className="mt-6 text-center sm:hidden">
        <a
          href="/blog"
          className="text-sm font-mono text-muted/50 hover:text-accent-amber transition-colors"
        >
          View all posts →
        </a>
      </div>
    </SectionWrapper>
  );
}
