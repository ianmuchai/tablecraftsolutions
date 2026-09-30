import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, Laptop, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getService } from "../api/client";
import { CtaBand } from "../components/sections";
import type { Service } from "../types";
import { NotFoundPage } from "./NotFoundPage";

export function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState<Service | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setMissing(false);
    getService(slug)
      .then(setService)
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <NotFoundPage />;
  if (!service) return <section className="section container">Loading service...</section>;

  const isStaffTraining = service.slug === "staff-training";

  return (
    <>
      <section className="detail-hero">
        <div className="container narrow">
          <Link className="back-link" to="/services">
            <ArrowLeft size={16} /> Services
          </Link>
          <p className="eyebrow">{service.eyebrow}</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
        </div>
      </section>
      <section className="detail-grid container">
        <div>
          <p className="eyebrow">Outcomes</p>
          <h2>What improves</h2>
          <ul className="check-list">
            {service.outcomes.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Deliverables</p>
          <h2>What you receive</h2>
          <ul className="check-list">
            {service.deliverables.map((item) => (
              <li key={item}>
                <CheckCircle2 size={18} /> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {isStaffTraining && (
        <section className="training-suite container">
          <div className="section-heading">
            <p className="eyebrow">Training delivery</p>
            <h2>Choose in-person or virtual staff training.</h2>
            <p>
              Staff training can be delivered on site for hands-on operational practice or virtually for guided learning,
              manager alignment, and follow-up coaching.
            </p>
          </div>

          <div className="training-options">
            {service.trainingOptions?.map((option) => {
              const Icon = option.mode === "In-person" ? UsersRound : Laptop;
              return (
                <article className="training-card" key={option.mode}>
                  <Icon size={28} />
                  <p className="eyebrow">{option.mode}</p>
                  <h3>{option.title}</h3>
                  <p>{option.summary}</p>
                  <ul className="check-list compact-list">
                    {option.bestFor.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={16} /> {item}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="excellence-focus">
            <div className="section-heading">
              <p className="eyebrow">We build excellence in hospitality</p>
              <h2>Training focus areas that improve people, systems, and results.</h2>
              <p>
                Our staff-development work mentors the next generation of restaurant managers and hospitality leaders
                while strengthening guest experience, visibility, productivity, and profitability.
              </p>
            </div>
            <div className="focus-area-grid">
              {service.excellenceFocusAreas?.map((area) => (
                <article className="focus-area-card" key={area.title}>
                  <TrendingUp size={22} />
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="learning-layout">
            <article className="learning-hub-card">
              <GraduationCap size={30} />
              <p className="eyebrow">Learning hub</p>
              <h2>{service.learningHub?.title}</h2>
              <p>{service.learningHub?.summary}</p>
              <ul className="check-list compact-list">
                {service.learningHub?.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle2 size={16} /> {feature}
                  </li>
                ))}
              </ul>
            </article>

            <div className="resource-list">
              <p className="eyebrow">Learning resources</p>
              <h2>Resources teams can keep using.</h2>
              {service.learningResources?.map((resource) => (
                <article className="resource-card" key={resource.title}>
                  <BookOpen size={22} />
                  <div>
                    <strong>{resource.title}</strong>
                    <span>{resource.format}</span>
                    <p>{resource.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
