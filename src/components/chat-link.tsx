"use client";

import { useState } from "react";
import { brand } from "@/lib/content";

declare global {
  interface Window {
    $crisp?: { push: (command: unknown[]) => void };
    CRISP_WEBSITE_ID?: string;
  }
}

export function ChatLink() {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const websiteId =
    process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ??
    "24164f41-20f7-43da-b799-2f23541ae008";

  function openChat() {
    if (document.getElementById("crisp-script")) {
      window.$crisp?.push(["do", "chat:open"]);
      return;
    }
    setState("loading");
    const queue = window.$crisp ?? ([] as unknown[][]);
    window.$crisp = queue;
    window.CRISP_WEBSITE_ID = websiteId;
    queue.push(["do", "chat:open"]);
    const script = document.createElement("script");
    script.id = "crisp-script";
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    const timeout = window.setTimeout(() => {
      setState("error");
    }, 12000);
    script.onload = () => {
      window.clearTimeout(timeout);
      setState("idle");
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      script.remove();
      setState("error");
    };
    document.head.appendChild(script);
  }

  return (
    <div className="chat-option">
      <button
        className="text-link"
        onClick={openChat}
        disabled={state === "loading"}
      >
        {state === "loading" ? "Opening chat…" : "Open live chat"}
        <span aria-hidden="true">↗</span>
      </button>
      {state === "error" && (
        <p role="status">
          Chat couldn’t load.{" "}
          <a href={brand.whatsapp}>Message us on WhatsApp</a>.
        </p>
      )}
    </div>
  );
}
