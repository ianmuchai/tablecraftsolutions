import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getInsights } from "../api/client";
import { PageHero } from "../components/sections";
import { editableText } from "../content/learningResources";
import type { Insight } from "../types";

export function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    getInsights().then(setInsights).catch(() => setInsights([]));
  }, []);

  return (
    <>
      <PageHero
        eyebrow={editableText("insights.hero.eyebrow", "Insights")}
        title={editableText("insights.hero.title", "Practical thinking for sharper restaurant decisions.")}
        copy={editableText("insights.hero.copy", "Short reads on menu strategy, launch planning, operations, and profitability habits.")}
        image="/hero-insights.png"
      />
      <section className="section container">
        <div className="article-grid">
          {insights.map((insight) => (
            <Link className="article-card" key={insight.slug} to={`/insights/${insight.slug}`}>
              <p className="eyebrow">{insight.category}</p>
              <h3>{insight.title}</h3>
              <p>{insight.excerpt}</p>
              <span>
                {insight.readTime} <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}


