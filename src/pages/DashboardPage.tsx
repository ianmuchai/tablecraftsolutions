import { Activity, BarChart3, Inbox, RefreshCw, Server } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardSummary } from "../api/client";
import type { CSSProperties } from "react";
import type { DashboardSummary } from "../types";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const heroStyle = { "--page-hero-image": "url(/hero-dashboard.png)" } as CSSProperties;

  const loadDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      setSummary(await getDashboardSummary());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Dashboard data is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  return (
    <>
      <section className="dashboard-hero image-hero" style={heroStyle}>
        <div className="container">
          <p className="eyebrow">Dynamic backend dashboard</p>
          <h1>Live TableCraft operations view</h1>
          <p>
            This page is powered by the Express backend. Submit the contact form, refresh here, and the inquiry will
            appear in the live submissions feed.
          </p>
          <button className="button light" type="button" onClick={loadDashboard} disabled={loading}>
            <RefreshCw size={18} /> {loading ? "Refreshing..." : "Refresh live data"}
          </button>
        </div>
      </section>

      <section className="dashboard-shell container">
        {error && <p className="form-feedback error">{error}</p>}
        <div className="dashboard-status">
          <Server size={22} />
          <div>
            <strong>Backend status</strong>
            <span>{summary ? `Connected. Last generated ${new Date(summary.generatedAt).toLocaleString()}` : "Checking API..."}</span>
          </div>
        </div>

        <div className="dashboard-metrics">
          {summary &&
            [
              { label: "Services", value: summary.totals.services, icon: BarChart3 },
              { label: "Case studies", value: summary.totals.caseStudies, icon: Activity },
              { label: "Insights", value: summary.totals.insights, icon: Inbox },
              { label: "Submissions", value: summary.totals.submissions, icon: Server }
            ].map((metric) => (
              <article className="dashboard-card" key={metric.label}>
                <metric.icon size={22} />
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </article>
            ))}
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-panel">
            <div className="panel-heading">
              <p className="eyebrow">Demand by service</p>
              <h2>Inquiry distribution</h2>
            </div>
            <div className="demand-list">
              {summary?.serviceDemand.map((service) => (
                <div className="demand-row" key={service.slug}>
                  <span>{service.title}</span>
                  <strong>{service.inquiries}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="panel-heading">
              <p className="eyebrow">Recent inquiries</p>
              <h2>Contact submissions</h2>
            </div>
            {summary && summary.recentSubmissions.length > 0 ? (
              <div className="submission-list">
                {summary.recentSubmissions.map((submission) => (
                  <article className="submission-card" key={submission.id}>
                    <strong>{submission.name}</strong>
                    <span>{submission.email}</span>
                    <p>{submission.message}</p>
                    <small>
                      {submission.service} - {new Date(submission.createdAt).toLocaleString()}
                    </small>
                  </article>
                ))}
              </div>
            ) : (
              <p className="empty-state compact">No inquiries yet. Submit the contact form to see one appear here.</p>
            )}
          </section>
        </div>
      </section>
    </>
  );
}
