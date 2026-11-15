import type { Metadata } from "next";
import Link from "next/link";
import { ContactCta, CurvedType, Tag } from "@/components/design";
import { ThreeObject } from "@/components/three-object";
import type { ObjectKind } from "@/components/object-art";
import { Arrow } from "@/components/icons";
import { capabilities } from "@/lib/content";

export const metadata: Metadata = {
  title: "What we do",
  alternates: { canonical: "/what-we-do" },
  openGraph: { url: "/what-we-do", title: "What we do — GreaterKandy" },
};

export default function Services() {
  return (
    <main id="main-content" className="services-page">
      <section className="page-hero services-hero paper">
        <Tag>What we do</Tag>
        <CurvedType lines={["PICK YOUR", "POSSIBILITY."]} />
        <p className="page-intro">
          Four ways to connect your brand with the world around it.
          <br />
          Find your starting point. We’ll take it from there.
        </p>
        <span className="handnote">Go on. Get curious. ↓</span>
      </section>
      <div className="service-catalog">
        {capabilities.map((service, i) => (
          <article
            key={service.slug}
            className={`service-product color-${service.color} paper`}
            data-reveal
          >
            <div className="product-heading">
              <span className="eyebrow">0{i + 1} / GREATERKANDY</span>
              <h2>{service.shortTitle}</h2>
            </div>
            <ThreeObject kind={service.object as ObjectKind} />
            <div className="product-description">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link href={`/what-we-do/${service.slug}`} className="button">
                Take a closer look <Arrow diagonal />
              </Link>
            </div>
            <span className="product-star" aria-hidden="true">
              ✳
            </span>
          </article>
        ))}
      </div>
      <section className="service-note paper">
        <Tag>One useful starting point</Tag>
        <h2>
          A BRAND.
          <br />A PLACE.
          <br />A CONVERSATION.
        </h2>
        <p>
          Not sure which direction fits? Tell us what you’re working towards.
          We’ll explore the audience, setting, and practical possibilities
          together.
        </p>
        <Link href="/contact" className="text-link">
          Let’s find your direction <Arrow diagonal />
        </Link>
      </section>
      <ContactCta />
    </main>
  );
}
