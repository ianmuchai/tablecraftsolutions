import { useEffect, useState } from "react";
import { getCaseStudies } from "../api/client";
import { CaseStudyGrid, PageHero } from "../components/sections";
import { editableText } from "../content/learningResources";
import { mergeManagedCaseStudies, readManagedCaseStudies } from "../content/managedContent";
import type { CaseStudy } from "../types";

export function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    getCaseStudies().then((items) => setCaseStudies(readManagedCaseStudies(mergeManagedCaseStudies(items)))).catch(() => setCaseStudies([]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={editableText("caseStudies.hero.eyebrow", "Case studies")}
        title={editableText("caseStudies.hero.title", "Result-focused examples from restaurant operating challenges.")}
        copy={editableText("caseStudies.hero.copy", "Representative projects showing how better systems improve clarity, consistency, and margin.")}
        image="/hero-case-studies.png"
      />
      <section className="section container">
        {caseStudies.length > 0 ? <CaseStudyGrid caseStudies={caseStudies} /> : <p className="empty-state">{editableText("caseStudies.empty", "Case studies are loading.")}</p>}
      </section>
    </>
  );
}


