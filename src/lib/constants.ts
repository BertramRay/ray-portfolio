export const SITE_CONFIG = {
  name: "Ray",
  title: "Engineer & Builder",
  tagline: "I build things that think.",
  email: "bertramray2000@gmail.com",
  social: {
    github: "https://github.com/BertramRay",
    linkedin: "https://www.linkedin.com/in/bertram-ray-4a8467199",
  },
};

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
] as const;

export interface Project {
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  image?: string;
  highlight?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "AhaCreator",
    highlight: "AI-Native Influencer Marketing",
    description:
      "AI-native influencer marketing from scratch. 5M+ creators, 140+ countries, LLM-powered scoring that actually works in production.",
    tags: ["Python", "Next.js", "MongoDB", "LLM", "FastAPI", "AWS"],
    link: "https://www.ahacreator.com",
  },
  {
    title: "Stablecoin Revolution",
    highlight: "Interactive Data Storytelling",
    description:
      "Immersive data storytelling on stablecoins reshaping global finance. Scroll-driven narratives, rich visualizations.",
    tags: ["React", "Data Viz", "TypeScript", "Web Animation"],
    link: "https://stablecoin-sv3nrkca.manus.space/",
  },
  {
    title: "Creator Quality Engine",
    highlight: "LLM Scoring at Scale",
    description:
      "Multi-dimensional AI scoring across IG, TikTok, YouTube. Custom prompt chains, audio transcription, visual analysis.",
    tags: ["Python", "LLM", "MongoDB", "FFmpeg", "S3", "FastAPI"],
    github: "https://github.com/BertramRay",
  },
  {
    title: "Prompt Eval Studio",
    highlight: "Systematic Prompt Engineering",
    description:
      "Versioned prompts, automated eval sets, human review, deviation analysis. Iterate like a scientist, not a gambler.",
    tags: ["Python", "Next.js", "MongoDB", "LLM Eval"],
  },
];

export interface SkillCategory {
  name: string;
  skills: { name: string; level: "Primary" | "Proficient" | "Familiar" }[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: "Languages",
    skills: [
      { name: "Python", level: "Primary" },
      { name: "TypeScript", level: "Primary" },
      { name: "SQL", level: "Primary" },
      { name: "JavaScript", level: "Proficient" },
      { name: "Go", level: "Familiar" },
      { name: "GLSL", level: "Familiar" },
    ],
  },
  {
    name: "Frameworks & Tools",
    skills: [
      { name: "Next.js", level: "Proficient" },
      { name: "FastAPI", level: "Primary" },
      { name: "React", level: "Proficient" },
      { name: "Node.js", level: "Proficient" },
      { name: "Tailwind CSS", level: "Proficient" },
      { name: "Three.js", level: "Familiar" },
    ],
  },
  {
    name: "Data & Infrastructure",
    skills: [
      { name: "MongoDB", level: "Primary" },
      { name: "PostgreSQL", level: "Proficient" },
      { name: "Redis", level: "Proficient" },
      { name: "Docker", level: "Proficient" },
      { name: "AWS S3", level: "Proficient" },
      { name: "Vercel", level: "Proficient" },
      { name: "Railway", level: "Proficient" },
    ],
  },
  {
    name: "AI & Machine Learning",
    skills: [
      { name: "Prompt Engineering", level: "Primary" },
      { name: "LLM Integration", level: "Primary" },
      { name: "AI SDK", level: "Proficient" },
      { name: "RAG Systems", level: "Proficient" },
      { name: "Data Pipeline Design", level: "Primary" },
      { name: "Multi-modal AI", level: "Proficient" },
    ],
  },
];

export interface Experience {
  title: string;
  company: string;
  companyUrl?: string;
  period: string;
  description: string;
  highlights: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    title: "Cofounder",
    company: "AhaLab · AhaCreator",
    companyUrl: "https://aha.inc",
    period: "2023 — Present",
    description:
      "AI-native influencer marketing, zero to global. Own the entire data + AI stack.",
    highlights: [
      "Multi-platform creator pipeline — 5M+ creators, 140+ countries",
      "LLM-powered quality scoring with custom prompt chains",
      "Built Prompt Eval Studio for measurable prompt iteration",
      "Real-time campaign analytics and fraud detection",
    ],
  },
  {
    title: "Backend Engineer",
    company: "Tech Startup",
    period: "2021 — 2023",
    description:
      "Data-intensive apps, real-time systems, API architecture. Best code = no 3am debugging.",
    highlights: [
      "Real-time data pipelines — Python, Redis, message queues",
      "APIs serving 100K+ daily requests, 99.9% uptime",
      "Automated monitoring and deployment workflows",
    ],
  },
];
