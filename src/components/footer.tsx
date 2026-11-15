import Link from "next/link";
import { brand, navigation, socials } from "@/lib/content";
import { CurvedType, Wordmark } from "./design";
import { ThreeObject } from "./three-object";

export function Footer() {
  return (
    <footer className="site-footer paper">
      <nav className="footer-nav" aria-label="Footer navigation">
        {navigation.slice(0, 3).map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
            <span aria-hidden="true">•</span>
          </Link>
        ))}
        <Link href="/contact">
          Contact<span aria-hidden="true">•</span>
        </Link>
      </nav>
      <div className="footer-center">
        <Link href="/" aria-label="GreaterKandy home">
          <Wordmark />
        </Link>
        <CurvedType as="h2" lines={["MAKE YOUR", "MARK."]} />
        <a className="footer-email" href={`mailto:${brand.email}`}>
          {brand.email} ↗
        </a>
      </div>
      <div className="footer-object" aria-hidden="true">
        <ThreeObject kind="flower" decorative />
      </div>
      <div className="footer-sticker sticker-blue" aria-hidden="true">
        <span>GOOD FOR YOUR BRAND</span>
        <strong>
          GOOD FOR
          <br />
          YOUR PLACE.
        </strong>
        <span>LET’S MAKE IT MATTER</span>
      </div>
      <div className="footer-socials">
        {socials.map((social, index) => (
          <a
            href={social.href}
            key={social.label}
            target="_blank"
            rel="noreferrer"
            aria-label={`${social.label} (opens in a new tab)`}
          >
            <span>{["ig", "in", "fb", "x"][index]}</span>
          </a>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GreaterKandy</span>
        <span>Kandy, Sri Lanka</span>
        <div>
          <Link href="/credits">Image & font credits</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
