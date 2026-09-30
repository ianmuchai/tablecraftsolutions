import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="not-found container narrow">
      <p className="eyebrow">Not found</p>
      <h1>This table is not set yet.</h1>
      <p>The page you are looking for may have moved, or the service is no longer available at this address.</p>
      <Link className="button" to="/">
        Return home
      </Link>
    </section>
  );
}
