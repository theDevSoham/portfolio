import { ImageResponse } from "next/og";

export const alt = "Soham Das — Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#06060a",
          color: "#ededf2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#2dd4e8",
            fontFamily: "monospace",
            marginBottom: 24,
          }}
        >
          {"// portfolio"}
        </div>
        <div style={{ display: "flex", fontSize: 100, fontWeight: 800, lineHeight: 1.05 }}>
          Soham Das
        </div>
        <div style={{ display: "flex", fontSize: 42, color: "#9a9aa8", marginTop: 14 }}>
          Full-Stack Developer
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 48,
            height: 8,
            width: 260,
            borderRadius: 8,
            background: "linear-gradient(90deg, #7c7cf0, #a855f7, #2dd4e8)",
          }}
        />
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#9a9aa8",
            fontFamily: "monospace",
          }}
        >
          next.js · react · typescript · node
        </div>
      </div>
    ),
    { ...size }
  );
}
