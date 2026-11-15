import type { Metadata } from "next";
import { ContactCta, CurvedType, Tag } from "@/components/design";
import { ThreeObject } from "@/components/three-object";
import { process } from "@/lib/content";
export const metadata: Metadata = {
  title: "Our approach",
  alternates: { canonical: "/our-approach" },
  openGraph: {
    url: "/our-approach",
    title: "Good ideas start here — GreaterKandy",
  },
};
export default function Approach() {
  return (
    <main id="main-content" className="approach-page">
      <section className="page-hero approach-hero paper">
        <Tag>How we think</Tag>
        <CurvedType lines={["GOOD IDEAS", "START HERE."]} />
        <p className="page-intro">
          Curiosity first. Care throughout.
          <br />A little structure gives a good idea room to grow.
        </p>
        <div className="approach-object">
          <ThreeObject kind="billboard" />
        </div>
      </section>
      <section className="process-stack paper" aria-label="Our process">
        {process.map((step, i) => (
          <article
            key={step.title}
            className={`process-sheet paper color-${["orange", "blue", "yellow", "coral"][i]}`}
            data-reveal
          >
            <div className="process-step">
              <span>STEP</span>
              <strong>0{i + 1}</strong>
            </div>
            <div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
              <span className="handnote">
                {
                  [
                    "Listen before you leap.",
                    "Give the idea a little room.",
                    "Put thought into motion.",
                    "Stay curious. Keep going.",
                  ][i]
                }
              </span>
            </div>
          </article>
        ))}
      </section>
      <section className="approach-promise paper">
        <Tag>Our commitment to consideration</Tag>
        <h2>
          A SMALLER FOOTPRINT
          <br />
          IS A BIG CONVERSATION.
        </h2>
        <p>
          Sustainability starts with questions about materials, production,
          energy, reuse, and local context. We consider these with you, and
          agree what can be measured for each brief.
        </p>
        <p>
          We don’t turn good intentions into unverified impact claims.
          Meaningful progress needs evidence.
        </p>
      </section>
      <ContactCta />
    </main>
  );
}
