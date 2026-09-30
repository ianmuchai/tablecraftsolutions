import { Award, Handshake, Layers3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompanyProfile } from "../api/client";
import { CtaBand, PageHero } from "../components/sections";
import type { CompanyProfile } from "../types";

export function AboutPage() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    getCompanyProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  const incorporation = profile?.incorporation;
  const leadership = profile?.leadership;

  return (
    <>
      <PageHero
        eyebrow="About TableCraft Solutions"
        title="Standards, systems, and excellence for stronger restaurant operations."
        copy="We build excellence in hospitality by helping restaurant teams sharpen service, leadership, visibility, productivity, and profitability."
        image="/hero-about.png"
      />
      <section className="split-section light about-intro-section">
        <div>
          <p className="eyebrow">Our point of view</p>
          <h2>Restaurants succeed when every layer is intentionally connected.</h2>
        </div>
        <p>
          TableCraft Solutions works with hospitality operators who need practical standards, repeatable systems, and
          disciplined execution. The work connects service culture, menu performance, leadership habits, operating rhythm,
          and commercial results so the restaurant can grow without losing consistency.
        </p>
      </section>

      <section className="company-story container">
        <div className="company-story-copy">
          <p className="eyebrow">Company story</p>
          <h2>Built around hospitality leadership, not generic consultancy language.</h2>
          <p>
            TableCraft Solutions is positioned as a restaurant consultancy for teams that want measurable improvement in
            guest experience, staff performance, and management discipline. The company profile below is integrated into
            the story so official incorporation and leadership details can sit naturally beside the operating philosophy.
          </p>
        </div>
        <div className="company-facts" aria-label="Company facts">
          <div className="fact-row">
            <span>Incorporation</span>
            <strong>{incorporation?.status ?? "Company records loading"}</strong>
            <p>{incorporation?.note ?? "Fetching official incorporation details from the backend."}</p>
          </div>
          <div className="fact-row">
            <span>Founder & CEO</span>
            <strong>{leadership?.founder ?? "Leadership details loading"}</strong>
            <p>{leadership?.note ?? "Fetching founder and CEO details from the backend."}</p>
          </div>
        </div>
      </section>

      <section className="section container about-values-section">
        <div className="value-grid">
          {[
            { icon: Layers3, title: "Layered thinking", copy: "We connect brand, operations, numbers, people, and guest flow." },
            { icon: Handshake, title: "Operator empathy", copy: "Recommendations are practical for real teams under real service pressure." },
            { icon: Award, title: "High standards", copy: "Every engagement aims for clearer execution and measurable improvement." }
          ].map((value) => (
            <article className="feature-card" key={value.title}>
              <value.icon size={26} />
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="story-band">
        <div>
          <p className="eyebrow">Consulting style</p>
          <h2>Clear diagnosis, sharper decisions, hands-on tools.</h2>
        </div>
        <p>
          We do not leave operators with theory alone. Each project creates working documents, standards, checklists, and
          rhythms the team can keep using after the engagement ends.
        </p>
      </section>
      <CtaBand />
    </>
  );
}


