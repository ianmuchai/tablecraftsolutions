import { ArrowLeft, BookOpen, CheckCircle2, GraduationCap, Laptop, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getService } from "../api/client";
import { CtaBand } from "../components/sections";
import { resolveSiteText } from "../content/learningResources";
import type { Service } from "../types";
import { NotFoundPage } from "./NotFoundPage";

const outcomeTooltip = (serviceTitle: string, item: string) => `Expected result for ${serviceTitle}: ${item}.`;

const deliverableContexts: Record<string, string> = {
  "restaurant-launch": "Pre-opening deliverable that turns the launch plan into a working restaurant system",
  "menu-engineering": "Menu engineering tool built to clarify pricing, item performance, and selling priorities",
  "operations-audits": "Operational audit output that shows managers exactly what to fix, sequence, and monitor",
  "staff-training": "Training asset designed for daily team coaching, role clarity, and service consistency",
  "brand-guest-experience": "Guest-experience guide that aligns brand promise with the actual moments guests feel",
  "cost-control": "Cost-control instrument for purchasing discipline, stock visibility, and margin protection"
};

const deliverableTooltip = (service: Service, item: string) => {
  const context = deliverableContexts[service.slug] ?? `${service.title} deliverable shaped for practical restaurant execution`;
  return `${context}: ${item}.`;
};

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
              <li className="hover-explainer" data-tooltip={outcomeTooltip(service.title, item)} key={item} tabIndex={0}>
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
              <li className="hover-explainer" data-tooltip={deliverableTooltip(service, item)} key={item} tabIndex={0}>
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
            <p>{resolveSiteText("staffTraining.delivery.copy")}</p>
          </div>

          <div className="training-options">
            {service.trainingOptions?.map((option) => {
              const Icon = option.mode === "In-person" ? UsersRound : Laptop;
              return (
                <article className="training-card hover-explainer" data-tooltip={option.summary} key={option.mode} tabIndex={0}>
                  <Icon size={28} />
                  <p className="eyebrow">{option.mode}</p>
                  <h3>{option.title}</h3>
                  <p>{option.summary}</p>
                  <ul className="check-list compact-list">
                    {option.bestFor.map((item) => (
                      <li className="hover-explainer" data-tooltip={`Best suited for: ${item}.`} key={item} tabIndex={0}>
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
                <article className="focus-area-card hover-explainer" data-tooltip={area.summary} key={area.title} tabIndex={0}>
                  <TrendingUp size={22} />
                  <h3>{area.title}</h3>
                  <p>{area.summary}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="learning-layout">
            <article className="learning-hub-card hover-explainer" data-tooltip={service.learningHub?.summary} tabIndex={0}>
              <GraduationCap size={30} />
              <p className="eyebrow">Learning hub</p>
              <h2>{service.learningHub?.title}</h2>
              <p>{service.learningHub?.summary}</p>
              <ul className="check-list compact-list">
                {service.learningHub?.features.map((feature) => (
                  <li className="hover-explainer" data-tooltip={`Learning hub feature: ${feature}.`} key={feature} tabIndex={0}>
                    <CheckCircle2 size={16} /> {feature}
                  </li>
                ))}
              </ul>
            </article>

            <div className="resource-list">
              <p className="eyebrow">Learning resources</p>
              <h2>Resources teams can keep using.</h2>
              {service.learningResources?.map((resource) => (
                <article className="resource-card hover-explainer" data-tooltip={resource.summary} key={resource.title} tabIndex={0}>
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
