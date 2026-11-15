import Image from "next/image";
import Link from "next/link";
import {
  ButtonLink,
  ContactCta,
  CurvedType,
  Ribbon,
  Tag,
} from "@/components/design";
import { ThreeObject } from "@/components/three-object";
import { ServicePlayground } from "@/components/service-playground";
import { Asterisk, Arrow } from "@/components/icons";

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-hero paper">
        <div className="hero-kicker">
          <span>GOOD FOR YOUR BRAND.</span>
          <span>GOOD FOR YOUR PLACE.</span>
        </div>
        <CurvedType lines={["MAKE YOUR", "MARK."]} />
        <div className="hero-object">
          <ThreeObject kind="megaphone" />
        </div>
        <div className="hero-stamp">
          <Asterisk />
          <span>
            BIG IDEAS.
            <br />
            LOCAL ROOTS.
          </span>
        </div>
        <div className="hero-bottom">
          <p>
            Advertising with something to say.
            <br />
            And a place to belong.
          </p>
          <ButtonLink href="/contact">Let’s make it happen</ButtonLink>
          <a className="hero-scroll" href="#hello">
            <span>GET TO KNOW US</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <span className="hero-side">
          SUSTAINABLE MARKETING · KANDY, SRI LANKA
        </span>
      </section>
      <section id="hello" className="hello-section paper">
        <div className="container hello-grid">
          <div>
            <Tag>Hello, we’re GreaterKandy</Tag>
            <h2 data-reveal>
              A LITTLE
              <br />
              LOUDER.
              <br />
              <span>
                A LOT MORE
                <br />
                THOUGHTFUL.
              </span>
            </h2>
          </div>
          <div className="hello-copy">
            <span className="handnote">More than a message. ↙</span>
            <p>
              We’re a sustainable marketing agency from Kandy, Sri Lanka. We
              connect brands, people, and places through advertising that
              belongs in everyday life.
            </p>
            <p>
              From a message on the street to a moment on a screen, we believe
              great visibility starts with a little more consideration.
            </p>
            <ButtonLink href="/about" light>
              Meet GreaterKandy
            </ButtonLink>
          </div>
        </div>
      </section>
      <Ribbon />
      <ServicePlayground />
      <section className="belief-section paper" id="approach">
        <div className="container">
          <Tag>Attention is only the beginning</Tag>
          <div className="belief-heading" data-reveal>
            <h2>
              <span className="manifesto-line">TO CONNECT.</span>
              <span className="manifesto-line">TO CONTRIBUTE.</span>
              <span className="manifesto-line">TO BELONG.</span>
            </h2>
            <Asterisk className="belief-asterisk" />
          </div>
          <div className="belief-bottom">
            <p>
              Make the message count. Consider the materials. Respect the place.
              Keep people at the heart of the idea.
            </p>
            <ButtonLink href="/our-approach" light>
              How we think
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="place-section paper" id="focus">
        <div className="container place-layout">
          <div className="place-picture" data-reveal>
            <span className="tape" />
            <Image
              src="/images/kandy-lake.webp"
              alt="Kandy Lake and the surrounding green hills, seen from the city viewpoint"
              width={1920}
              height={909}
              sizes="(max-width: 768px) 90vw, 55vw"
            />
            <span className="photo-caption">
              Our hometown. Our starting point.
            </span>
          </div>
          <div className="place-copy">
            <Tag>Rooted here. Looking ahead.</Tag>
            <h2>
              SMALL ISLAND.
              <br />
              BIG POSSIBILITIES.
            </h2>
            <p>
              Kandy is more than our address. It’s our everyday reminder that
              brands share the places people call home.
            </p>
            <Link className="text-link" href="/focus">
              Explore our areas of focus <Arrow diagonal />
            </Link>
          </div>
          <span className="handnote place-note">
            Good things grow
            <br />
            from local roots.
          </span>
        </div>
      </section>
      <ContactCta />
    </main>
  );
}
