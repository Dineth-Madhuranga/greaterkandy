import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ChatLink } from "@/components/chat-link";
import { CurvedType, Tag } from "@/components/design";
import { brand } from "@/lib/content";

export const metadata: Metadata = {
  title: "Let’s talk",
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Let’s make something matter — GreaterKandy",
  },
};

export default function Contact() {
  return (
    <main id="main-content" className="contact-page paper">
      <section className="page-hero contact-hero">
        <Tag>Get in touch</Tag>
        <CurvedType lines={["LET’S MAKE", "IT MATTER."]} />
        <span className="handnote">Your next big thing starts here. ↙</span>
      </section>
      <section className="contact-sheet paper">
        <span className="tape" />
        <div className="contact-sheet-top">
          <h2>
            DROP US
            <br />A MESSAGE.
          </h2>
          <p>
            A new idea, a question, a possibility.
            <br />
            We’d love to hear what’s on your mind.
          </p>
        </div>
        <ContactForm />
        <div className="contact-alternatives">
          <div>
            <span className="eyebrow">WRITE TO US</span>
            <a href={`mailto:${brand.email}`}>{brand.email} ↗</a>
          </div>
          <div>
            <span className="eyebrow">GIVE US A CALL</span>
            <a href={`tel:${brand.phoneHref}`}>{brand.phone} ↗</a>
          </div>
          <div>
            <span className="eyebrow">SAY A QUICK HELLO</span>
            <a href={brand.whatsapp}>WhatsApp ↗</a>
            <ChatLink />
          </div>
        </div>
        <div className="contact-location">
          <span>GREATERKANDY</span>
          <span>{brand.address}</span>
          <span className="handnote">Good conversations welcome.</span>
        </div>
      </section>
    </main>
  );
}
