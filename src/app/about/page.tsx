import type { Metadata } from "next";
import Image from "next/image";
import {
  ButtonLink,
  ContactCta,
  CurvedType,
  Ribbon,
  Tag,
} from "@/components/design";
import { ThreeObject } from "@/components/three-object";
import { considerations } from "@/lib/content";

export const metadata: Metadata = {
  title: "About us",
  alternates: { canonical: "/about" },
  openGraph: {
    url: "/about",
    title: "About GreaterKandy — Local roots. Big ideas.",
  },
};

export default function About() {
  return (
    <main id="main-content" className="about-page">
      <section className="page-hero about-hero paper">
        <Tag>A little about us</Tag>
        <CurvedType lines={["LOCAL ROOTS.", "BIG IDEAS."]} />
        <p className="page-intro">
          A sustainable marketing agency with Kandy at heart.
          <br />
          And a belief that good ideas can belong everywhere.
        </p>
        <div className="about-collage">
          <figure className="about-photo paper">
            <span className="tape" />
            <Image
              src="/images/kandy-city.webp"
              alt="The city of Kandy surrounded by Sri Lanka’s central hills"
              width={1440}
              height={1080}
              sizes="(max-width:768px) 85vw, 58vw"
              priority
            />
            <figcaption>7.2906° N · 80.6337° E — HOME, SWEET HOME.</figcaption>
          </figure>
          <div className="about-object">
            <ThreeObject kind="flower" />
          </div>
          <span className="handnote about-note">
            Made of local
            <br />
            possibilities. ↙
          </span>
        </div>
      </section>
      <section className="about-story paper">
        <div className="container split-story">
          <Tag>What brings us together</Tag>
          <div>
            <h2>
              BRANDS LIVE
              <br />
              IN THE REAL WORLD.
              <br />
              <span>
                LET’S MAKE IT
                <br />A BETTER ONE.
              </span>
            </h2>
            <div className="story-columns">
              <p>
                GreaterKandy connects businesses, people, and public spaces
                through sustainable marketing. Our work starts with the
                relationship between a brand and the place it becomes part of.
              </p>
              <p>
                We explore outdoor visibility, digital signage, brand
                engagement, and opportunities for community initiatives. Every
                conversation begins with a simple question: how can this be
                useful here?
              </p>
            </div>
          </div>
        </div>
      </section>
      <Ribbon text="A LITTLE CARE GOES A LONG WAY." blue />
      <section className="values-section paper">
        <div className="container">
          <Tag>What we believe</Tag>
          <h2>
            MAKE AN IMPACT.
            <br />
            GIVE IT SOME THOUGHT.
          </h2>
          <div className="values-window">
            <div className="values-list">
              {considerations.map((item, i) => (
                <article key={item.title} data-reveal>
                  <span className="value-number">0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="section-end">
            <span className="handnote">Thoughtfulness is a practice.</span>
            <ButtonLink href="/our-approach">Our approach</ButtonLink>
          </div>
        </div>
      </section>
      <ContactCta />
    </main>
  );
}
