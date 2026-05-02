import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff7ed", // light orange (orange-50 vibe)
          padding: "60px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#ea580c", // orange-600
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#9a3412", // darker orange
            }}
          >
            Arinvoice
          </span>
        </div>

        {/* Center */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#7c2d12",
              lineHeight: 1.1,
            }}
          >
            Free Invoice Generator
          </h1>

          <p
            style={{
              fontSize: 28,
              color: "#9a3412",
              maxWidth: "800px",
            }}
          >
            Create GST-ready invoices instantly. Export PDF. No signup required.
          </p>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#c2410c",
            }}
          >
            arinvoice.studio
          </div>

          <div
            style={{
              background: "#ea580c",
              color: "white",
              padding: "14px 24px",
              borderRadius: "12px",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Generate Now →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}