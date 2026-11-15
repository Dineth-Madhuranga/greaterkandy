import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Image credits",
  alternates: { canonical: "/credits" },
  openGraph: { url: "/credits", title: "Image credits — GreaterKandy" },
};

export default function Credits() {
  return (
    <main id="main-content" className="container credits-page">
      <p className="eyebrow">The people behind the pictures</p>
      <h1>
        Acknowledging
        <br />
        another perspective.
      </h1>
      <p>
        The photographs on this site show Kandy’s local context. They do not
        depict GreaterKandy’s completed projects or imply endorsement by their
        photographers.
      </p>
      <article>
        <h2>Kandy Lake View from Kandy View Point</h2>
        <p>
          Photograph by Rilwan19760430, 2020.{" "}
          <a href="https://commons.wikimedia.org/wiki/File:Kandy_Lake_View_from_Kandy_View_Point.jpg">
            Original on Wikimedia Commons
          </a>
          .
        </p>
        <p>
          Licensed under{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            Creative Commons Attribution-ShareAlike 4.0
          </a>
          . Resized, converted to WebP, and cropped in page layouts. The adapted
          image is available under the same license.
        </p>
        <a href="/images/kandy-lake.webp" download>
          Download the adapted image
        </a>
      </article>
      <article>
        <h2>View point of Kandy</h2>
        <p>
          Photograph by Charles R. Benedict, 2018.{" "}
          <a href="https://commons.wikimedia.org/wiki/File:View_point_of_Kandy.jpg">
            Original on Wikimedia Commons
          </a>
          .
        </p>
        <p>
          Licensed under{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/">
            Creative Commons Attribution-ShareAlike 4.0
          </a>
          . Resized, converted to WebP, and cropped in page layouts. The adapted
          image is available under the same license.
        </p>
        <a href="/images/kandy-city.webp" download>
          Download the adapted image
        </a>
      </article>
      <p>
        Barlow Condensed, Inter Tight, and Nothing You Could Do are self-hosted
        under the SIL Open Font License. The 3D advertising objects, vector
        illustrations, and paper texture were created for this website.
      </p>
      <Link className="text-link" href="/">
        Back to GreaterKandy <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
