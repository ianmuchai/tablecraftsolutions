import { Activity, BarChart3, ClipboardList, Inbox, LockKeyhole, RefreshCw, Server, UserRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { getAdminSession, getDashboardSummary, loginAdmin, logoutAdmin } from "../api/client";
import { dashboardServiceInterests, defaultUserProfile, userProfileStorageKey } from "../content/dashboardUsers";
import type { CSSProperties } from "react";
import type { AdminSession, DashboardSummary, DashboardUserProfile } from "../types";

const loadStoredProfile = (): DashboardUserProfile => {
  if (typeof window === "undefined") return defaultUserProfile;
  const stored = window.localStorage.getItem(userProfileStorageKey);
  if (!stored) return defaultUserProfile;
  try {
    return { ...defaultUserProfile, ...(JSON.parse(stored) as Partial<DashboardUserProfile>), role: "user" };
  } catch {
    return defaultUserProfile;
  }
};

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<"admin" | "user">("admin");
  const [adminSession, setAdminSession] = useState<AdminSession>({ authenticated: false });
  const [adminCredentials, setAdminCredentials] = useState({ username: "Farhan", password: "" });
  const [adminFeedback, setAdminFeedback] = useState("");
  const [userProfile, setUserProfile] = useState<DashboardUserProfile>(defaultUserProfile);
  const [userSaved, setUserSaved] = useState(false);
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
    getAdminSession().then(setAdminSession).catch(() => setAdminSession({ authenticated: false }));
    setUserProfile(loadStoredProfile());
  }, []);

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAdminFeedback("");
    try {
      const session = await loginAdmin(adminCredentials);
      setAdminSession(session);
      setAdminCredentials((current) => ({ ...current, password: "" }));
    } catch (loginError) {
      setAdminFeedback(loginError instanceof Error ? loginError.message : "Unable to sign in.");
    }
  };

  const handleAdminLogout = async () => {
    setAdminSession(await logoutAdmin().catch(() => ({ authenticated: false as const })));
  };

  const updateUserProfile = (key: keyof DashboardUserProfile, value: string) => {
    setUserSaved(false);
    setUserProfile((current) => ({ ...current, [key]: value, role: "user" }));
  };

  const saveUserProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.localStorage.setItem(userProfileStorageKey, JSON.stringify(userProfile));
    setUserSaved(true);
  };

  return (
    <>
      <section className="dashboard-hero image-hero" style={heroStyle}>
        <div className="container">
          <p className="eyebrow">Dashboard</p>
          <h1>TableCraft account workspace</h1>
          <p>
            Admins can review operational inquiries and service demand. Users can create a profile for consultation follow-up and training interests.
          </p>
        </div>
      </section>

      <section className="dashboard-shell container professional-dashboard">
        <div className="role-switch" aria-label="Dashboard role selection">
          <button className={activeRole === "admin" ? "active" : ""} type="button" onClick={() => setActiveRole("admin")}>
            <LockKeyhole size={18} /> Admin
          </button>
          <button className={activeRole === "user" ? "active" : ""} type="button" onClick={() => setActiveRole("user")}>
            <UserRound size={18} /> User profile
          </button>
        </div>

        {activeRole === "admin" ? (
          <div className="dashboard-account-grid">
            <section className="dashboard-panel auth-panel">
              <div className="panel-heading">
                <p className="eyebrow">Admin access</p>
                <h2>{adminSession.authenticated ? `Welcome, ${adminSession.name}` : "Sign in to manage dashboard data."}</h2>
              </div>
              {adminSession.authenticated ? (
                <div className="profile-summary">
                  <p>Admin profile can view service demand, inquiry summaries, and live operational status.</p>
                  <button className="button" type="button" onClick={handleAdminLogout}>Sign out</button>
                </div>
              ) : (
                <form className="dashboard-form" onSubmit={handleAdminLogin}>
                  <label>
                    Username
                    <input value={adminCredentials.username} onChange={(event) => setAdminCredentials((current) => ({ ...current, username: event.target.value }))} />
                  </label>
                  <label>
                    Password
                    <input type="password" value={adminCredentials.password} onChange={(event) => setAdminCredentials((current) => ({ ...current, password: event.target.value }))} />
                  </label>
                  {adminFeedback && <p className="form-feedback error">{adminFeedback}</p>}
                  <button className="button" type="submit">Sign in</button>
                  <p className="auth-note">Set `ADMIN_PASSWORD` and `AUTH_SECRET` in Vercel before using production admin login.</p>
                </form>
              )}
            </section>

            {adminSession.authenticated && (
              <section className="dashboard-panel admin-data-panel">
                <div className="panel-heading compact-heading">
                  <div>
                    <p className="eyebrow">Operations</p>
                    <h2>Admin overview</h2>
                  </div>
                  <button className="button light compact-button" type="button" onClick={loadDashboard} disabled={loading}>
                    <RefreshCw size={18} /> {loading ? "Refreshing" : "Refresh"}
                  </button>
                </div>
                {error && <p className="form-feedback error">{error}</p>}
                <div className="dashboard-status compact-status">
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
                  <section className="dashboard-panel nested-panel">
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
                  <section className="dashboard-panel nested-panel">
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
                            <small>{submission.service} - {new Date(submission.createdAt).toLocaleString()}</small>
                          </article>
                        ))}
                      </div>
                    ) : (
                      <p className="empty-state compact">No inquiries yet. Submit the contact form to see one appear here.</p>
                    )}
                  </section>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="dashboard-account-grid user-account-grid">
            <section className="dashboard-panel auth-panel">
              <div className="panel-heading">
                <p className="eyebrow">User profile</p>
                <h2>Create your consultation profile.</h2>
              </div>
              <form className="dashboard-form" onSubmit={saveUserProfile}>
                <label>
                  Full name
                  <input value={userProfile.name} onChange={(event) => updateUserProfile("name", event.target.value)} />
                </label>
                <label>
                  Email
                  <input type="email" value={userProfile.email} onChange={(event) => updateUserProfile("email", event.target.value)} />
                </label>
                <label>
                  Restaurant / Company
                  <input value={userProfile.company} onChange={(event) => updateUserProfile("company", event.target.value)} />
                </label>
                <label>
                  Service interest
                  <select value={userProfile.serviceInterest} onChange={(event) => updateUserProfile("serviceInterest", event.target.value)}>
                    <option value="">Choose an interest</option>
                    {dashboardServiceInterests.map((interest) => <option key={interest} value={interest}>{interest}</option>)}
                  </select>
                </label>
                <label>
                  Notes
                  <textarea rows={5} value={userProfile.notes} onChange={(event) => updateUserProfile("notes", event.target.value)} />
                </label>
                {userSaved && <p className="form-feedback success">Profile saved on this device.</p>}
                <button className="button" type="submit">Save user profile</button>
                <p className="auth-note">User profiles are saved privately in this browser until a database is connected.</p>
              </form>
            </section>
            <section className="dashboard-panel profile-preview-panel">
              <ClipboardList size={28} />
              <p className="eyebrow">Profile preview</p>
              <h2>{userProfile.name || "New TableCraft user"}</h2>
              <dl className="profile-list">
                <div><dt>Email</dt><dd>{userProfile.email || "Not set"}</dd></div>
                <div><dt>Company</dt><dd>{userProfile.company || "Not set"}</dd></div>
                <div><dt>Interest</dt><dd>{userProfile.serviceInterest || "Not set"}</dd></div>
              </dl>
              <p>{userProfile.notes || "Add notes about your restaurant goals, staff training needs, launch plans, or operational challenges."}</p>
            </section>
          </div>
        )}
      </section>
    </>
  );
}
