import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Arrow } from "./icons";

export function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <span className={`wordmark ${small ? "small" : ""}`}>
      <span>GREATER</span>
      <span>
        KANDY<span className="wordmark-star">✳</span>
      </span>
    </span>
  );
}

export function CurvedType({
  lines,
  as = "h1",
  className = "",
}: {
  lines: string[];
  as?: "h1" | "h2";
  className?: string;
}) {
  const Tag = as;
  return (
    <Tag className={`curved-type ${className}`} aria-label={lines.join(" ")}>
      {lines.map((line, row) => (
        <span className="type-line" aria-hidden="true" key={line}>
          {[...line].map((char, index) => {
            const fraction =
              line.length === 1 ? 0 : (index / (line.length - 1) - 0.5) * 2;
            return (
              <span
                key={index}
                className={char === " " ? "type-space" : "glyph"}
                style={
                  {
                    "--tilt": `${fraction * -7}deg`,
                    "--lift": `${(1 - fraction * fraction) * (row % 2 ? -0.04 : 0.09)}em`,
                    "--delay": `${index * 22 + row * 100}ms`,
                  } as CSSProperties
                }
              >
                {char === " " ? (
                  "\u00a0"
                ) : (
                  <span className="glyph-ink">{char}</span>
                )}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="tag">
      <span aria-hidden="true">⠿</span>
      {children}
    </span>
  );
}

export function ButtonLink({
  href,
  children,
  light = false,
}: {
  href: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <Link href={href} className={`button ${light ? "button-light" : ""}`}>
      <span>{children}</span>
      <Arrow diagonal />
    </Link>
  );
}

export function Ribbon({
  text = "GOOD IDEAS. GREAT PLACES. GREATER KANDY.",
  blue = false,
}: {
  text?: string;
  blue?: boolean;
}) {
  return (
    <div
      className={`ribbon-wrap ${blue ? "ribbon-blue" : ""}`}
      aria-hidden="true"
    >
      <div className="ribbon">
        <div className="ribbon-track">
          {[0, 1, 2, 3].map((n) => (
            <span key={n}>
              {text} <i>✳</i>{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContactCta() {
  return (
    <section className="contact-cta paper" data-reveal>
      <Tag>Good things start with a conversation</Tag>
      <CurvedType as="h2" lines={["GOT A BIG", "LITTLE IDEA?"]} />
      <p>Let’s give it a place in the world.</p>
      <ButtonLink href="/contact">Let’s talk</ButtonLink>
      <span className="handnote cta-note">We’re all ears. ↗</span>
    </section>
  );
}
