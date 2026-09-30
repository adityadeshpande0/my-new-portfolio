export type ProjectFocus = "Architecture" | "UI" | "Full-stack" | "AI";

export const projectFilters: Array<"All" | ProjectFocus> = ["All", "Architecture", "UI", "Full-stack", "AI"];

export interface Project {
  slug: string;
  title: string;
  year: string;
  tags: string[];
  /** Segments wrapped in *asterisks* render as italic emphasis. */
  summary: string;
  github?: string;
  /** Visual motif for the procedurally drawn mockup cluster. */
  motif: "graph" | "components" | "trophy" | "chat";
  focus: ProjectFocus[];
}

export const projects: Project[] = [
  {
    slug: "nx-monorepo-migration",
    title: "Nx Monorepo Migration",
    year: "2025",
    tags: ["Nx", "React", "TypeScript", "Azure DevOps"],
    summary:
      "Moved a fleet of enterprise React apps into a *single Nx workspace* — shared libraries, *consistent builds*, and CI that only rebuilds what changed.",
    motif: "graph",
    focus: ["Architecture"],
  },
  {
    slug: "ui-component-library",
    title: "Shared UI Component Library",
    year: "2025",
    tags: ["React", "MUI", "TypeScript", "Storybook"],
    summary:
      "A themed *Material UI* library that gave several teams one visual language — *accessible* by default and documented in Storybook.",
    motif: "components",
    focus: ["UI", "Architecture"],
  },
  {
    slug: "techzooka-hackathon",
    title: "Techzooka Hackathon",
    year: "2023",
    tags: ["React", "TypeScript", "Hackathon"],
    summary:
      "A rapid prototype built under a 48-hour clock that took *Runner-Up* at Infosys Techzooka — scoped *ruthlessly*, demoed confidently.",
    motif: "trophy",
    focus: ["Full-stack", "UI"],
  },
  {
    slug: "ai-side-project",
    title: "AI Assistant Playground",
    year: "2024",
    tags: ["Next.js", "OpenAI SDK", "ASP.NET Core"],
    summary:
      "An *OpenAI-powered* app exploring streaming chat UX on Next.js with a *typed* ASP.NET Core backend for orchestration.",
    github: "https://github.com/adityadeshpande0",
    motif: "chat",
    focus: ["AI", "Full-stack"],
  },
];
