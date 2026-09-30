import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { CaseStudy, Service, Testimonial } from "../types";

export function PageHero({
  eyebrow,
  title,
  copy,
  image
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image?: string;
}) {
  const style = image ? ({ "--page-hero-image": `url(${image})` } as CSSProperties) : undefined;

  return (
    <section className={image ? "page-hero image-hero" : "page-hero"} style={style}>
      <div className="container narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
    </section>
  );
}

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="card-grid">
      {services.map((service) => (
        <Link className="feature-card link-card" key={service.slug} to={`/services/${service.slug}`}>
          <p className="eyebrow">{service.eyebrow}</p>
          <h3>{service.title}</h3>
          <p>{service.summary}</p>
          <span>
            Explore service <ArrowRight size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CaseStudyGrid({ caseStudies }: { caseStudies: CaseStudy[] }) {
  return (
    <div className="case-grid">
      {caseStudies.map((study) => (
        <article className="case-card" key={study.slug}>
          <p className="eyebrow">{study.category}</p>
          <h3>{study.title}</h3>
          <p>{study.summary}</p>
          <ul>
            {study.metrics.map((metric) => (
              <li key={metric}>
                <CheckCircle2 size={16} />
                {metric}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="testimonial-grid">
      {testimonials.map((testimonial) => (
        <figure className="quote-card" key={testimonial.name}>
          <blockquote>{testimonial.quote}</blockquote>
          <figcaption>
            <strong>{testimonial.name}</strong>
            <span>{testimonial.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function CtaBand() {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">Ready for a sharper operation?</p>
        <h2>Let us build the restaurant system behind your next stage.</h2>
      </div>
      <Link className="button light" to="/contact">
        Start a conversation
      </Link>
    </section>
  );
}
