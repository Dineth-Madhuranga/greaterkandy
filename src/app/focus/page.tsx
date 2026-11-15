import type { Metadata } from "next";
import { ContactCta, CurvedType, Tag } from "@/components/design";
import { FocusBrowser } from "@/components/focus-browser";
export const metadata: Metadata = {
  title: "Our focus",
  alternates: { canonical: "/focus" },
  openGraph: {
    url: "/focus",
    title: "A place for possibilities — GreaterKandy",
  },
};
export default function Focus() {
  return (
    <main id="main-content" className="focus-page paper">
      <section className="page-hero focus-hero">
        <Tag>Our areas of focus</Tag>
        <CurvedType lines={["A PLACE FOR", "POSSIBILITIES."]} />
        <p className="page-intro">
          Better connections. Greener environments. More useful public spaces.
          <br />A few things we’d love to see more of.
        </p>
      </section>
      <div className="container">
        <FocusBrowser />
      </div>
      <ContactCta />
    </main>
  );
}
