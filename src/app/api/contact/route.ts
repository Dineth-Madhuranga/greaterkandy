import { NextResponse } from "next/server";

export const runtime = "nodejs";
const failure =
  "We couldn’t confirm delivery. Please email info@greaterkandy.org or call +94 77 769 2126.";

export async function POST(request: Request) {
  // Same-origin form submission only. Never expose backend credentials to clients.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json(
      { success: false, message: "Invalid request origin." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ success: false }, { status: 415 });
  if (Number(request.headers.get("content-length") ?? 0) > 20000)
    return NextResponse.json(
      { success: false, message: "Message is too long." },
      { status: 413 },
    );

  let input: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 20000)
      return NextResponse.json({ success: false }, { status: 413 });
    input = JSON.parse(raw);
    if (!input || typeof input !== "object" || Array.isArray(input))
      throw new Error("Invalid input");
  } catch {
    return NextResponse.json(
      { success: false, message: "Please check your enquiry." },
      { status: 400 },
    );
  }

  const value = (field: string) =>
    typeof input[field] === "string" ? input[field].trim() : "";
  const name = value("name"),
    email = value("email"),
    company = value("company"),
    message = value("message");
  if (value("website"))
    return NextResponse.json(
      { success: false, message: "Please check your enquiry." },
      { status: 400 },
    );
  if (
    name.length < 2 ||
    name.length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    company.length > 160 ||
    message.length < 10 ||
    message.length > 5000 ||
    /[\r\n]/.test(name + email + company)
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check your name, email, and message.",
      },
      { status: 400 },
    );
  }

  // Preserve the existing live site's { name, email, subject, message } contract.
  // An explicitly empty setting disables forwarding rather than reporting success.
  const endpoint =
    process.env.CONTACT_API_URL ??
    "https://greater-kandy-mauve.vercel.app/api/contact";
  if (!endpoint)
    return NextResponse.json(
      { success: false, message: failure },
      { status: 503 },
    );
  try {
    const url = new URL(endpoint);
    if (
      url.origin === new URL(request.url).origin &&
      url.pathname === "/api/contact"
    )
      throw new Error("Recursive backend");
    if (
      !["http:", "https:"].includes(url.protocol) ||
      (process.env.NODE_ENV === "production" && url.protocol !== "https:")
    )
      throw new Error("Invalid backend");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.CONTACT_API_TOKEN
          ? { Authorization: `Bearer ${process.env.CONTACT_API_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        name,
        email,
        subject: "Website enquiry" + (company ? ` — ${company}` : ""),
        message: company ? `Company: ${company}\n\n${message}` : message,
      }),
      signal: AbortSignal.timeout(12000),
      cache: "no-store",
      redirect: "error",
    });
    const result = await response.json();
    if (!response.ok || result.success !== true)
      throw new Error("Backend did not confirm receipt");
    return NextResponse.json({ success: true });
  } catch {
    // Do not log enquiry content or upstream details containing personal data.
    return NextResponse.json(
      { success: false, message: failure },
      { status: 502 },
    );
  }
}
