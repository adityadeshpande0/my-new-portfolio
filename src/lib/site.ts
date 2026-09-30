import { profile } from "@/content/profile";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl).replace(/\/$/, "");
export const siteTitle = "Aditya Deshpande — Full-stack Engineer (React · .NET)";
export const siteDescription =
  "Portfolio of Aditya Deshpande, a full-stack engineer with 4+ years building enterprise React, TypeScript and ASP.NET Core applications.";
