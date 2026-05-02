import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fff7ed",
          padding: "60px",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Top */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#ea580c",
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 700 }}>
            Arinvoice
          </span>
        </div>

        {/* Center */}
        <div>
          <h1 style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>
            Invoice Generator for India
          </h1>
          <p style={{ fontSize: 28 }}>
            Create invoices instantly with UPI & PDF export
          </p>
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>arinvoice.studio</span>
          <div
            style={{
              background: "#ea580c",
              color: "white",
              padding: "12px 20px",
              borderRadius: 10,
            }}
          >
            Generate Now →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}