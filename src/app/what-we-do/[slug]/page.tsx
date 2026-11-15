import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { capabilities, process } from "@/lib/content";
import { ButtonLink, ContactCta, CurvedType, Tag } from "@/components/design";
import { ThreeObject } from "@/components/three-object";
import type { ObjectKind } from "@/components/object-art";
import { Arrow } from "@/components/icons";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return capabilities.map((service) => ({ slug: service.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = capabilities.find((item) => item.slug === slug);
  return {
    title: service?.title ?? "Service not found",
    description: service?.description,
    alternates: { canonical: `/what-we-do/${slug}` },
    openGraph: {
      url: `/what-we-do/${slug}`,
      title: `${service?.title ?? "Services"} — GreaterKandy`,
    },
  };
}

export default async function ServiceDetail({ params }: Props) {
  const { slug } = await params;
  const index = capabilities.findIndex((item) => item.slug === slug);
  if (index < 0) notFound();
  const service = capabilities[index],
    next = capabilities[(index + 1) % capabilities.length];
  const heading = service.shortTitle.replace(".", "").toUpperCase().split(" ");
  const lines = [heading.slice(0, -1).join(" "), `${heading.at(-1)}.`];
  return (
    <main id="main-content">
      <section className={`service-detail-hero color-${service.color} paper`}>
        <div className="detail-top">
          <Link href="/what-we-do" className="text-link">
            ← All services
          </Link>
          <span className="eyebrow">0{index + 1} / 04</span>
        </div>
        <div className="detail-hero-grid">
          <div>
            <Tag>{service.title}</Tag>
            <CurvedType lines={lines} />
            <p>{service.description}</p>
            <ButtonLink href="/contact">Let’s explore it</ButtonLink>
          </div>
          <ThreeObject kind={service.object as ObjectKind} />
        </div>
      </section>
      <section className="detail-services paper">
        <div className="container">
          <div className="detail-intro">
            <Tag>The possibilities</Tag>
            <h2>
              THERE’S MORE
              <br />
              THAN ONE WAY IN.
            </h2>
            <p>
              Start with what your audience needs. Then explore the right
              format, setting, and message for your brand.
            </p>
          </div>
          <div className="detail-accordion">
            {service.services.map((item, i) => (
              <details key={item} name="service-options" open={i === 0}>
                <summary>
                  <span>0{i + 1}</span>
                  <h3>{item}</h3>
                  <span className="plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>
                  {
                    [
                      "Let’s explore how this could fit your brand, audience, and location. We’ll begin with your objectives and discuss what a useful, considered approach would look like.",
                      "The right opportunity depends on the context. Together, we can consider the practical requirements, local relevance, and people who need to be involved.",
                      "A clear brief helps good ideas move forward. We’ll discuss the scope, available opportunities, and next steps before making any commitments.",
                    ][i]
                  }
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="mini-process paper">
        <div className="container">
          <Tag>From a thought to a plan</Tag>
          <h2>
            GOOD IDEAS
            <br />
            NEED GOOD QUESTIONS.
          </h2>
          <div>
            {process.map((step, i) => (
              <article key={step.title}>
                <span>0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <Link href="/our-approach" className="text-link">
            Explore our approach <Arrow diagonal />
          </Link>
        </div>
      </section>
      <section className={`next-service color-${next.color} paper`}>
        <span className="eyebrow">UP NEXT</span>
        <Link href={`/what-we-do/${next.slug}`}>
          {next.shortTitle}
          <Arrow diagonal />
        </Link>
        <p>{next.title}</p>
      </section>
      <ContactCta />
    </main>
  );
}
