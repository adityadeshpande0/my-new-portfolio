export interface ExperienceItem {
  company: string;
  location: string;
  role: string;
  start: string;
  end: string;
  duration: string;
  current?: boolean;
  stack: string[];
  highlights: string[];
}

export const experience: ExperienceItem[] = [
  {
    company: "VConstruct",
    location: "Pune",
    role: "Software Engineer",
    start: "Aug 2025",
    end: "Present",
    duration: "Current",
    current: true,
    stack: ["React", "TypeScript", "ASP.NET Core", "C#", "SQL", "Snowflake"],
    highlights: [
      "Enterprise web apps for construction management and business-critical operational workflows.",
      "End-to-end features: responsive React UIs, ASP.NET Core REST APIs, Snowflake integration.",
      "Played a key role in migrating frontend apps to an Nx monorepo, improving code sharing, build consistency, and maintainability.",
      "Built reusable Material UI components and shared libraries that set consistent UI standards across teams.",
      "Performance work: React rendering optimization, state management, API and query improvements.",
      "Participated in solution design, sprint planning, backlog refinement, and estimation.",
      "Code reviews, Git workflows, Azure DevOps CI/CD, automated testing, SonarQube.",
    ],
  },
  {
    company: "Infosys",
    location: "Pune",
    role: "System Engineer",
    start: "Feb 2022",
    end: "Jul 2025",
    duration: "3 yrs 6 mos",
    stack: ["React", "React Native", "TypeScript", "Redux Toolkit", "React Query"],
    highlights: [
      "Web and mobile solutions across Fuel Data, E-Commerce, and Rewards platforms.",
      "Reduced page load times by 25% through rendering, component architecture, and state optimizations.",
      "Reduced data fetch times by 40% with React Query and Axios caching and sync.",
      "Scalable state management with Redux Toolkit and Redux Thunk.",
      "Reduced technical debt by 30% by modernizing legacy code to SonarQube standards.",
    ],
  },
  {
    company: "Collabera",
    location: "Vadodara",
    role: "Talent Specialist",
    start: "May 2021",
    end: "Jan 2022",
    duration: "9 mos",
    stack: ["US IT Recruitment"],
    highlights: ["US IT recruiter; managed the full recruitment lifecycle for US clients."],
  },
];

export const experienceSummary = "Work experience — *4+ years*";
