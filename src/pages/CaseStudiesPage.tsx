import { useEffect, useState } from "react";
import { getCaseStudies } from "../api/client";
import { CaseStudyGrid, PageHero } from "../components/sections";
import type { CaseStudy } from "../types";

export function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    getCaseStudies().then(setCaseStudies).catch(() => setCaseStudies([]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Result-focused examples from restaurant operating challenges."
        copy="Representative projects showing how better systems improve clarity, consistency, and margin."
        image="/hero-case-studies.png"
      />
      <section className="section container">
        {caseStudies.length > 0 ? <CaseStudyGrid caseStudies={caseStudies} /> : <p className="empty-state">Case studies are loading.</p>}
      </section>
    </>
  );
}


