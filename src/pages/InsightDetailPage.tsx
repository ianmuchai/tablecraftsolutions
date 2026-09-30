import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getInsight } from "../api/client";
import type { Insight } from "../types";
import { NotFoundPage } from "./NotFoundPage";

export function InsightDetailPage() {
  const { slug } = useParams();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setMissing(false);
    getInsight(slug)
      .then(setInsight)
      .catch(() => setMissing(true));
  }, [slug]);

  if (missing) return <NotFoundPage />;
  if (!insight) return <section className="section container">Loading insight...</section>;

  return (
    <article className="article-detail container narrow">
      <Link className="back-link" to="/insights">
        <ArrowLeft size={16} /> Insights
      </Link>
      <p className="eyebrow">{insight.category}</p>
      <h1>{insight.title}</h1>
      <p className="article-meta">{insight.readTime}</p>
      {insight.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  );
}
