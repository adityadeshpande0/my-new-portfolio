import { profile } from "@/content/profile";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? profile.siteUrl).replace(/\/$/, "");
export const siteTitle = "Aditya Deshpande — Full-stack Engineer (React · .NET)";
export const siteDescription =
  "Portfolio of Aditya Deshpande, a full-stack engineer with 4+ years building enterprise React, TypeScript and ASP.NET Core applications.";

export const articlesTitle = "Articles";
export const articlesDescription =
  "Notes by Aditya Deshpande on React, TypeScript, .NET, front-end architecture and building software that lasts.";
/** Stable id of the site owner's Person entity (declared in the root layout's JSON-LD). */
export const personId = `${siteUrl}/#person`;

/** RSS autodiscovery. Next replaces (not merges) `alternates` per page, so pages that set a canonical spread this in. */
export const rssAlternate = {
  types: { "application/rss+xml": [{ url: "/articles/rss.xml", title: "Articles — Aditya Deshpande" }] },
};
