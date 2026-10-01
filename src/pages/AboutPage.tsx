import { Award, Handshake, Layers3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCompanyProfile } from "../api/client";
import { CtaBand, PageHero } from "../components/sections";
import { editableText } from "../content/learningResources";
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
        eyebrow={editableText("about.hero.eyebrow", "About TableCraft Solutions")}
        title={editableText("about.hero.title", "Standards, systems, and excellence for stronger restaurant operations.")}
        copy={editableText("about.hero.copy", "We build excellence in hospitality by helping restaurant teams sharpen service, leadership, visibility, productivity, and profitability.")}
        image="/hero-about.png"
      />
      <section className="split-section light about-intro-section">
        <div>
          <p className="eyebrow">{editableText("about.point.eyebrow", "Our point of view")}</p>
          <h2>{editableText("about.point.title", "Restaurants succeed when every layer is intentionally connected.")}</h2>
        </div>
        <p>{editableText("about.point.copy", "TableCraft Solutions works with hospitality operators who need practical standards, repeatable systems, and disciplined execution. The work connects service culture, menu performance, leadership habits, operating rhythm, and commercial results so the restaurant can grow without losing consistency.")}</p>
      </section>

      <section className="company-story container">
        <div className="company-story-copy">
          <p className="eyebrow">{editableText("about.story.eyebrow", "Company story")}</p>
          <h2>{editableText("about.story.title", "Built around practical hospitality leadership.")}</h2>
          <p>{editableText("about.story.copy", "TableCraft Solutions is positioned as a restaurant consultancy for teams that want measurable improvement in guest experience, staff performance, and management discipline. The company story connects official incorporation and leadership details to a clear operating philosophy.")}</p>
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
            <p>{editableText("about.leadership.copy", leadership?.note || "Fetching founder and CEO details from the backend.")}</p>
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
          <p className="eyebrow">{editableText("about.style.eyebrow", "Consulting style")}</p>
          <h2>{editableText("about.style.title", "Clear diagnosis, sharper decisions, hands-on tools.")}</h2>
        </div>
        <p>{editableText("about.style.copy", "We do not leave operators with theory alone. Each project creates working documents, standards, checklists, and rhythms the team can keep using after the engagement ends.")}</p>
      </section>
      <CtaBand />
    </>
  );
}
