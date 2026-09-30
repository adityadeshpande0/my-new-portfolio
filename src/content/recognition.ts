export interface Certification {
  title: string;
  issuer: string;
  credentialId: string;
  verifyUrl: string;
}

export interface Award {
  title: string;
  detail: string;
}

export const certifications: Certification[] = [
  {
    title: "Azure Administrator Associate",
    issuer: "Microsoft Certified",
    credentialId: "26B080808A23A53C",
    verifyUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/anvdeshpande/26B080808A23A53C?sharingId=404C6E10179D7855",
  },
  {
    title: "Azure Fundamentals",
    issuer: "Microsoft Certified",
    credentialId: "48516A86BE774AFF",
    verifyUrl:
      "https://learn.microsoft.com/api/credentials/share/en-us/anvdeshpande/48516A86BE774AFF?sharingId=404C6E10179D7855",
  },
];

export const awards: Award[] = [
  { title: "Infosys Techzooka Hackathon", detail: "Runner-Up" },
  { title: "Infosys GitHub Codethon", detail: "Top Finalist" },
  {
    title: "Infosys Tech-Cohere Chapter",
    detail: "RnR award for implementing and demonstrating GitHub Copilot across multiple projects",
  },
  { title: "Project Recognition", detail: "Appreciation for outstanding project contributions" },
];
