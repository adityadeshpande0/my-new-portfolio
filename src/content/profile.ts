export interface SocialLink {
  label: "GitHub" | "LinkedIn" | "Email" | "Resume";
  href: string;
  external?: boolean;
  download?: boolean;
}

export const profile = {
  name: "Aditya N. Deshpande",
  displayName: ["Aditya", "Deshpande"] as const,
  shortName: "Aditya",
  initials: "AD",
  wordmark: "aditya.dev",
  role: "Full-stack Engineer — React · .NET",
  // Segments wrapped in *asterisks* render as italic emphasis.
  tagline:
    "I build *maintainable*, *high-performance* enterprise apps — from pixel-perfect React interfaces to *scalable* ASP.NET Core APIs.",
  about:
    "Hello! I'm Aditya, a *full-stack engineer* with *4+ years* building enterprise React and .NET applications. I started as a mechanical engineer, spent a year in tech recruiting, and then moved into software. That path taught me to think in *systems* and to understand what teams actually need.",
  email: "adityadeshpande1@outlook.com",
  // Phone number intentionally omitted: it lives only in the downloadable resume.
  location: "Pune, India",
  siteUrl: "https://aditya.dev",
  resume: "/resume/Aditya_Deshpande_Resume.pdf",
  portrait: "/images/profile.jpg",
  links: {
    github: "https://github.com/adityadeshpande0",
    linkedin: "https://www.linkedin.com/in/adityadeshpande1/",
    portfolio: "https://adityadeshpande.netlify.app/",
  },
  education: {
    degree: "B.E. Mechanical Engineering",
    school: "Amravati University",
    year: 2019,
  },
  stats: [
    { value: 4, suffix: "+", label: "years building enterprise apps" },
    { value: 25, suffix: "%", label: "faster page loads" },
    { value: 40, suffix: "%", label: "faster data fetching" },
    { value: 30, suffix: "%", label: "less tech debt" },
  ],
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: profile.links.github, external: true },
  { label: "LinkedIn", href: profile.links.linkedin, external: true },
  { label: "Email", href: `mailto:${profile.email}` },
  { label: "Resume", href: profile.resume, download: true },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;
