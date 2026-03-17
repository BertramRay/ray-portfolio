"use client";

import { motion } from "framer-motion";

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  index: number;
}

export default function BlogCard({
  title,
  description,
  date,
  slug,
  index,
}: BlogCardProps) {
  return (
    <motion.a
      href={`/blog/${slug}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="block group"
    >
      <article className="card-interactive h-full bg-card-bg border border-border rounded-xl p-6 hover:border-accent-amber/25 hover:bg-card-bg-hover">
        <time className="text-xs font-mono text-muted/60 tracking-wide">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <h3 className="text-base md:text-lg font-semibold mt-3 mb-3 group-hover:text-accent-amber transition-colors duration-300 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-muted leading-relaxed line-clamp-3">
          {description}
        </p>
        <span className="inline-block mt-5 text-sm font-mono text-accent-amber/70 group-hover:text-accent-amber transition-colors duration-300">
          Read more
          <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </span>
      </article>
    </motion.a>
  );
}
