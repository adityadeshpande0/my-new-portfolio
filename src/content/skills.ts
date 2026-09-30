export interface SkillGroup {
  id: string;
  title: string;
  items: string[];
  /** Bento sizing hint on desktop. */
  size: "lg" | "md" | "sm";
  inverse?: boolean;
}

export const skills: SkillGroup[] = [
  {
    id: "frontend",
    title: "Frontend",
    size: "lg",
    inverse: true,
    items: [
      "React.js",
      "React Native",
      "Next.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "SASS",
      "Styled Components",
      "Tailwind CSS",
      "Bootstrap",
      "Material UI",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    size: "md",
    items: ["ASP.NET Core Web API", "C#", "Node.js", "Express.js", "REST APIs"],
  },
  { id: "state", title: "State & Data", size: "sm", items: ["Redux Toolkit", "Redux Thunk", "React Query", "Axios"] },
  { id: "database", title: "Database", size: "sm", items: ["SQL Server", "Snowflake", "MongoDB"] },
  { id: "cloud", title: "Cloud & DevOps", size: "md", items: ["Microsoft Azure", "Azure DevOps", "CI/CD", "Nx"] },
  { id: "testing", title: "Testing & Quality", size: "sm", items: ["Jest", "React Testing Library", "SonarQube"] },
  { id: "ai", title: "AI", size: "sm", items: ["OpenAI API", "OpenAI SDK", "GitHub Copilot"] },
  { id: "tools", title: "Tools", size: "sm", items: ["Git", "GitHub", "Agile", "Scrum"] },
];

export const skillsCaption = "Some of my *favorite* technologies, topics, or tools that I worked with";
