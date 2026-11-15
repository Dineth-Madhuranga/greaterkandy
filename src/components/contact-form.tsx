"use client";

import { useRef, useState, type FormEvent } from "react";
import { Arrow } from "./icons";
import { brand } from "@/lib/content";

type Fields = "name" | "email" | "company" | "message";
type Errors = Partial<Record<Fields, string>>;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = Object.fromEntries(
      ["name", "email", "company", "message", "website"].map((field) => [
        field,
        String(data.get(field) ?? "").trim(),
      ]),
    );
    const nextErrors: Errors = {};
    if (values.name.length < 2)
      nextErrors.name = "Please enter your name (at least 2 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = "Please enter a valid email address.";
    if (values.message.length < 10)
      nextErrors.message = "Tell us a little more (at least 10 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("idle");
      setFeedback("Please check the highlighted fields.");
      const first = Object.keys(nextErrors)[0];
      (form.elements.namedItem(first) as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    setFeedback("Sending your enquiry…");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        signal: AbortSignal.timeout(18000),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw new Error("Submission not confirmed");
      setStatus("success");
      setFeedback(
        "Thank you. Your enquiry has been received. We look forward to the conversation.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setFeedback(
        "We couldn’t confirm delivery. Your message is still here. Please try again, email us, or call us directly.",
      );
    }
  }

  return (
    <form
      ref={formRef}
      className="contact-form"
      action="/api/contact"
      method="post"
      onSubmit={submit}
      noValidate
      aria-busy={status === "sending"}
    >
      <div className="form-row">
        {(
          [
            {
              name: "name",
              label: "Your name",
              type: "text",
              autocomplete: "name",
              placeholder: "How should we call you?",
            },
            {
              name: "email",
              label: "Email address",
              type: "email",
              autocomplete: "email",
              placeholder: "you@company.com",
            },
          ] as const
        ).map((field) => (
          <div className="form-field" key={field.name}>
            <label htmlFor={`contact-${field.name}`}>
              {field.label}
              <span aria-hidden="true"> *</span>
            </label>
            <input
              id={`contact-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autocomplete}
              placeholder={field.placeholder}
              required
              maxLength={field.name === "name" ? 120 : 254}
              aria-invalid={!!errors[field.name]}
              aria-describedby={
                errors[field.name] ? `error-${field.name}` : undefined
              }
            />
            <p className="field-error" id={`error-${field.name}`}>
              {errors[field.name]}
            </p>
          </div>
        ))}
      </div>
      <div className="form-field">
        <label htmlFor="contact-company">
          Company <span>(optional)</span>
        </label>
        <input
          id="contact-company"
          name="company"
          autoComplete="organization"
          placeholder="Where you’re coming from"
          maxLength={160}
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">
          What do you have in mind?<span aria-hidden="true"> *</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          placeholder="A brand, a place, an idea. We’d love to hear it."
          required
          minLength={10}
          maxLength={5000}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "error-message" : undefined}
        />
        <p className="field-error" id="error-message">
          {errors.message}
        </p>
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="form-bottom">
        <p>We’ll use these details to respond to your enquiry.</p>
        <button
          className="button"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Start a conversation"}
          <Arrow diagonal />
        </button>
      </div>
      <div
        className={`form-feedback ${status}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback}
        {status === "error" && (
          <span className="feedback-contact">
            <a href={`mailto:${brand.email}`}>{brand.email}</a> ·{" "}
            <a href={`tel:${brand.phoneHref}`}>{brand.phone}</a>
          </span>
        )}
      </div>
      <noscript>
        <style>{".contact-form .form-bottom button { display: none; }"}</style>
        <p>
          The enquiry form needs JavaScript to send. Please email{" "}
          <a href={`mailto:${brand.email}`}>{brand.email}</a> or call{" "}
          <a href={`tel:${brand.phoneHref}`}>{brand.phone}</a>.
        </p>
      </noscript>
    </form>
  );
}
