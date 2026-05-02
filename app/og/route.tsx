// app/og/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff7ed",
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "#7c2d12",
              textAlign: "center",
              padding: "0 60px",
            }}
          >
            Invoice Generator for India
          </div>

          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: "#9a3412",
              textAlign: "center",
              padding: "0 60px",
            }}
          >
            Free • UPI • PDF • No Signup
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response("OG image failed", { status: 500 });
  }
}