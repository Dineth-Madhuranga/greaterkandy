import { test, expect } from "@playwright/test";
import { POST } from "../src/app/api/contact/route";

const valid = {
  name: "Test Visitor",
  email: "visitor@example.com",
  company: "Example",
  message: "A meaningful test message.",
  website: "",
};
function request(body: unknown, origin = "https://greaterkandy.org") {
  return new Request("https://greaterkandy.org/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify(body),
  });
}

test("contact handler validates input and rejects cross-origin requests before forwarding", async () => {
  const previous = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error("Must not forward invalid input");
  };
  try {
    for (const body of [
      { ...valid, name: "" },
      { ...valid, email: "invalid" },
      { ...valid, message: "short" },
      { ...valid, website: "spam" },
      { ...valid, name: "Name\nInjected" },
      { ...valid, message: "x".repeat(6000) },
      null,
    ]) {
      expect((await POST(request(body))).status).toBe(400);
    }
    expect(
      (await POST(request(valid, "https://unrelated.example"))).status,
    ).toBe(403);
    expect(calls).toBe(0);
  } finally {
    globalThis.fetch = previous;
  }
});

test("contact proxy preserves the original contract and requires explicit backend success", async () => {
  const previous = globalThis.fetch;
  const previousUrl = process.env.CONTACT_API_URL;
  process.env.CONTACT_API_URL = "https://backend.example/api/contact";
  try {
    let forwarded: Record<string, string> | undefined;
    globalThis.fetch = async (_url, init) => {
      forwarded = JSON.parse(String(init?.body));
      return Response.json({ success: true });
    };
    const response = await POST(request(valid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(forwarded).toEqual({
      name: valid.name,
      email: valid.email,
      subject: "Website enquiry — Example",
      message: `Company: Example\n\n${valid.message}`,
    });
    for (const result of [{ success: false }, {}, { success: "true" }]) {
      globalThis.fetch = async () => Response.json(result);
      expect((await POST(request(valid))).status).toBe(502);
    }
    globalThis.fetch = async () =>
      Response.json({ success: true }, { status: 500 });
    expect((await POST(request(valid))).status).toBe(502);
    globalThis.fetch = async () => {
      throw new Error("Network unavailable");
    };
    expect((await POST(request(valid))).status).toBe(502);
    process.env.CONTACT_API_URL = "";
    expect((await POST(request(valid))).status).toBe(503);
  } finally {
    globalThis.fetch = previous;
    if (previousUrl === undefined) delete process.env.CONTACT_API_URL;
    else process.env.CONTACT_API_URL = previousUrl;
  }
});
