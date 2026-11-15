import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "GreaterKandy — Make your mark. Sustainable marketing, rooted in Kandy.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function OpenGraphImage() {
  const font = await readFile(
    join(process.cwd(), "src/app/fonts/barlow-condensed.ttf"),
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#034102",
        color: "#b6fe00",
        padding: "45px 65px",
        fontFamily: "Barlow",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 30,
        }}
      >
        <span>GREATER KANDY</span>
        <span>BIG IDEAS. LOCAL ROOTS.</span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 190,
          lineHeight: 0.86,
          letterSpacing: -4,
        }}
      >
        <span>MAKE YOUR</span>
        <span>MARK.</span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #b6fe00",
          paddingTop: 20,
          fontSize: 27,
        }}
      >
        <span>SUSTAINABLE MARKETING</span>
        <span>KANDY, SRI LANKA ↗</span>
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 270,
          width: 210,
          height: 210,
          borderRadius: "50%",
          background: "#fa8005",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#034102",
          fontSize: 140,
          transform: "rotate(-15deg)",
        }}
      >
        GK
      </div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Barlow", data: font, style: "normal", weight: 900 }],
    },
  );
}
