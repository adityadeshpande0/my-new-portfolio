import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = "Aditya Deshpande — Full-stack Engineer (React · .NET)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "radial-gradient(60% 70% at 78% 30%, rgba(232,161,92,0.35), rgba(11,11,12,0) 70%), #0B0B0C",
        color: "#EDEDED",
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#8A8A8F" }}>
        …/<span style={{ color: "#EDEDED" }}>{profile.wordmark}</span>…
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 110, fontWeight: 700, letterSpacing: -5, lineHeight: 1 }}>Aditya</div>
        <div
          style={{
            display: "flex",
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: -5,
            lineHeight: 1,
            paddingLeft: 140,
          }}
        >
          Deshpande<span style={{ color: "#E8A15C" }}>.</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
        <span>{profile.role}</span>
        <span style={{ color: "#E8A15C" }}>4+ years</span>
      </div>
    </div>,
    size,
  );
}
