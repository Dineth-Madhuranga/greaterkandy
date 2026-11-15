import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found paper">
      <p className="tag">404 · A little off the path</p>
      <h1>
        LOST YOUR
        <br />
        PLACE?
      </h1>
      <p>This page isn’t here. Let’s get you back to somewhere good.</p>
      <Link href="/" className="button">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </main>
  );
}
