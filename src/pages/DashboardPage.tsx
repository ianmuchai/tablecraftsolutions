import {
  Activity,
  BarChart3,
  ClipboardList,
  Download,
  FileText,
  Inbox,
  LockKeyhole,
  RefreshCw,
  Save,
  Server,
  ShieldCheck,
  Upload,
  UserRound
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { getAdminSession, getDashboardSummary, loginAdmin, logoutAdmin } from "../api/client";
import { dashboardServiceInterests, defaultUserProfile, loginUserAccount, readStoredUserSession, registerUserAccount, storeUserSession, userAccountsStorageKey, userProfileStorageKey } from "../content/dashboardUsers";
import {
  canUserDownloadResource,
  defaultLearningResourceAccessRules,
  defaultManagedLearningResources,
  defaultSiteTextRecords,
  learningAccessRulesStorageKey,
  learningResourcesStorageKey,
  siteTextStorageKey
} from "../content/learningResources";
import type { CSSProperties } from "react";
import type {
  AdminSession,
  DashboardSummary,
  DashboardUserAccount,
  DashboardUserProfile,
  LearningResourceAccessRule,
  ManagedLearningResource,
  SiteTextRecord
} from "../types";

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const stored = window.localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

const loadStoredProfile = (): DashboardUserProfile => {
  const stored = loadJson<Partial<DashboardUserProfile>>(userProfileStorageKey, {});
  return { ...defaultUserProfile, ...stored, role: "user" };
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
  const [userAccounts, setUserAccounts] = useState<DashboardUserAccount[]>([]);
  const [userAuthMode, setUserAuthMode] = useState<"create" | "login">("create");
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  const [userFeedback, setUserFeedback] = useState("");
  const [userSaved, setUserSaved] = useState(false);
  const [resources, setResources] = useState<ManagedLearningResource[]>(defaultManagedLearningResources);
  const [accessRules, setAccessRules] = useState<LearningResourceAccessRule[]>(defaultLearningResourceAccessRules);
  const [siteTextRecords, setSiteTextRecords] = useState<SiteTextRecord[]>(defaultSiteTextRecords);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resourceDraft, setResourceDraft] = useState({ title: "", summary: "", audience: "Staff training users" });
  const [ruleDraft, setRuleDraft] = useState<Pick<LearningResourceAccessRule, "resourceId" | "scope" | "value">>({
    resourceId: "all",
    scope: "all",
    value: "All logged-in staff-training users"
  });
  const [managementFeedback, setManagementFeedback] = useState("");
  const heroStyle = { "--page-hero-image": "url(/hero-dashboard.png)" } as CSSProperties;

  const permittedResources = useMemo(
    () => resources.filter((resource) => canUserDownloadResource(userProfile, resource, accessRules)),
    [accessRules, resources, userProfile]
  );

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
    setResources(loadJson(learningResourcesStorageKey, defaultManagedLearningResources));
    setAccessRules(loadJson(learningAccessRulesStorageKey, defaultLearningResourceAccessRules));
    setSiteTextRecords(loadJson(siteTextStorageKey, defaultSiteTextRecords));
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
    setUserFeedback("");
    const result = registerUserAccount(userAccounts, userProfile);
    if (result.error) {
      setUserSaved(false);
      setUserFeedback(result.error);
      return;
    }

    setUserAccounts(result.accounts);
    saveJson(userAccountsStorageKey, result.accounts);
    saveJson(userProfileStorageKey, userProfile);
    storeUserSession(null);
    setUserSaved(true);
    setUserFeedback(result.message ?? "Account created. Please log in with your email and password.");
    setUserAuthMode("login");
    setUserLogin({ email: userProfile.email, password: "" });
  };

  const handleUserLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUserFeedback("");
    const result = loginUserAccount(userAccounts, userLogin.email, userLogin.password);
    if (result.error || !result.session || !result.profile) {
      setUserSaved(false);
      setUserFeedback(result.error ?? "Invalid email or password.");
      return;
    }

    setUserProfile({ ...defaultUserProfile, ...result.profile, role: "user" });
    saveJson(userProfileStorageKey, result.profile);
    storeUserSession(result.session);
    setUserSaved(true);
    setUserFeedback(`Logged in as ${result.session.firstName}.`);
  };

  const handleUserLogout = () => {
    storeUserSession(null);
    setUserSaved(false);
    setUserFeedback("Signed out.");
  };

  const persistResources = (nextResources: ManagedLearningResource[]) => {
    setResources(nextResources);
    saveJson(learningResourcesStorageKey, nextResources);
  };

  const persistRules = (nextRules: LearningResourceAccessRule[]) => {
    setAccessRules(nextRules);
    saveJson(learningAccessRulesStorageKey, nextRules);
  };

  const persistTextRecords = (nextRecords: SiteTextRecord[]) => {
    setSiteTextRecords(nextRecords);
    saveJson(siteTextStorageKey, nextRecords);
  };

  const handleResourceUpload = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setManagementFeedback("");
    if (!selectedFile) {
      setManagementFeedback("Choose a file before uploading a learning resource.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const nextResource: ManagedLearningResource = {
        id: `resource-${Date.now()}`,
        title: resourceDraft.title.trim() || selectedFile.name.replace(/\.[^.]+$/, ""),
        format: selectedFile.type || "Download",
        summary: resourceDraft.summary.trim() || "Staff-training resource uploaded by the admin.",
        audience: resourceDraft.audience.trim() || "Staff training users",
        fileName: selectedFile.name,
        downloadUrl: String(reader.result),
        uploadedAt: new Date().toISOString()
      };
      persistResources([nextResource, ...resources]);
      setResourceDraft({ title: "", summary: "", audience: "Staff training users" });
      setSelectedFile(null);
      setManagementFeedback("Learning resource uploaded and ready for access rules.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const addAccessRule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextRule: LearningResourceAccessRule = {
      id: `rule-${Date.now()}`,
      resourceId: ruleDraft.resourceId,
      scope: ruleDraft.scope,
      value: ruleDraft.scope === "all" ? "All logged-in staff-training users" : ruleDraft.value.trim(),
      enabled: true
    };
    persistRules([nextRule, ...accessRules]);
    setRuleDraft({ resourceId: "all", scope: "all", value: "All logged-in staff-training users" });
    setManagementFeedback("Access rule saved.");
  };

  const toggleRule = (ruleId: string) => {
    persistRules(accessRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)));
  };

  const updateTextRecord = (id: string, value: string) => {
    persistTextRecords(siteTextRecords.map((record) => (record.id === id ? { ...record, value } : record)));
    setManagementFeedback("Site text saved. Refresh public pages in this browser to see local edits.");
  };

  return (
    <>
      <section className="dashboard-hero image-hero" style={heroStyle}>
        <div className="container">
          <p className="eyebrow">Dashboard</p>
          <h1>TableCraft account workspace</h1>
          <p>
            Admins manage learning resources, access, and site text. Users can save a profile and download approved staff-training materials.
          </p>
        </div>
      </section>

      <section className="dashboard-shell container professional-dashboard">
        <div className="role-switch" aria-label="Dashboard role selection">
          <button className={activeRole === "admin" ? "active" : ""} type="button" onClick={() => setActiveRole("admin")}>
            <LockKeyhole size={18} /> Admin
          </button>
          <button className={activeRole === "user" ? "active" : ""} type="button" onClick={() => setActiveRole("user")}>
            <UserRound size={18} /> User login
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
                  <p>Admin profile can manage resources, user access, relevant site text, inquiry summaries, and live operational status.</p>
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
                {managementFeedback && <p className="form-feedback success">{managementFeedback}</p>}
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
                <div className="management-grid">
                  <section className="dashboard-panel nested-panel management-panel">
                    <div className="panel-heading">
                      <p className="eyebrow">Learning resources</p>
                      <h2>Upload staff-training material</h2>
                    </div>
                    <form className="dashboard-form" onSubmit={handleResourceUpload}>
                      <label>
                        Resource title
                        <input value={resourceDraft.title} onChange={(event) => setResourceDraft((current) => ({ ...current, title: event.target.value }))} />
                      </label>
                      <label>
                        Short description
                        <textarea rows={3} value={resourceDraft.summary} onChange={(event) => setResourceDraft((current) => ({ ...current, summary: event.target.value }))} />
                      </label>
                      <label>
                        Audience
                        <input value={resourceDraft.audience} onChange={(event) => setResourceDraft((current) => ({ ...current, audience: event.target.value }))} />
                      </label>
                      <label>
                        File
                        <input type="file" onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)} />
                      </label>
                      <button className="button" type="submit"><Upload size={18} /> Upload resource</button>
                    </form>
                  </section>

                  <section className="dashboard-panel nested-panel management-panel">
                    <div className="panel-heading">
                      <p className="eyebrow">Access control</p>
                      <h2>Manage who can download</h2>
                    </div>
                    <form className="dashboard-form" onSubmit={addAccessRule}>
                      <label>
                        Resource
                        <select value={ruleDraft.resourceId} onChange={(event) => setRuleDraft((current) => ({ ...current, resourceId: event.target.value }))}>
                          <option value="all">All resources</option>
                          {resources.map((resource) => <option key={resource.id} value={resource.id}>{resource.title}</option>)}
                        </select>
                      </label>
                      <label>
                        Access type
                        <select value={ruleDraft.scope} onChange={(event) => setRuleDraft((current) => ({ ...current, scope: event.target.value as LearningResourceAccessRule["scope"] }))}>
                          <option value="all">All logged-in users</option>
                          <option value="email">Specific email</option>
                          <option value="domain">Email domain</option>
                        </select>
                      </label>
                      {ruleDraft.scope !== "all" && (
                        <label>
                          Value
                          <input placeholder={ruleDraft.scope === "email" ? "manager@example.com" : "example.com"} value={ruleDraft.value} onChange={(event) => setRuleDraft((current) => ({ ...current, value: event.target.value }))} />
                        </label>
                      )}
                      <button className="button" type="submit"><ShieldCheck size={18} /> Add access rule</button>
                    </form>
                    <div className="rule-list">
                      {accessRules.map((rule) => (
                        <button className={rule.enabled ? "rule-pill active" : "rule-pill"} key={rule.id} type="button" onClick={() => toggleRule(rule.id)}>
                          {rule.enabled ? "Enabled" : "Disabled"} - {rule.scope}: {rule.value}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="dashboard-panel nested-panel management-panel text-management-panel">
                  <div className="panel-heading">
                    <p className="eyebrow">Site text</p>
                    <h2>Edit relevant page copy</h2>
                  </div>
                  <div className="text-record-grid">
                    {siteTextRecords.map((record) => (
                      <label className="text-record" key={record.id}>
                        <span>{record.page} - {record.label}</span>
                        <textarea rows={4} value={record.value} onChange={(event) => updateTextRecord(record.id, event.target.value)} />
                      </label>
                    ))}
                  </div>
                </section>

                <div className="resource-admin-list">
                  {resources.map((resource) => (
                    <article className="resource-card" key={resource.id}>
                      <FileText size={22} />
                      <div>
                        <strong>{resource.title}</strong>
                        <span>{resource.audience}</span>
                        <p>{resource.summary}</p>
                        <small>{resource.fileName}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="user-auth-workspace">
            <section className="auth-surface">
              <div className="auth-mode-switch" aria-label="User account mode">
                <button className={userAuthMode === "create" ? "active" : ""} type="button" onClick={() => setUserAuthMode("create")}>Create account</button>
                <button className={userAuthMode === "login" ? "active" : ""} type="button" onClick={() => setUserAuthMode("login")}>Log in</button>
              </div>

              {userAuthMode === "create" ? (
                <form className="dashboard-form auth-form" onSubmit={saveUserProfile}>
                  <div className="panel-heading">
                    <p className="eyebrow">Create account</p>
                    <h2>Set up your learning access.</h2>
                  </div>
                  <label>
                    Full name
                    <input value={userProfile.name} onChange={(event) => updateUserProfile("name", event.target.value)} />
                  </label>
                  <label>
                    Email
                    <input type="email" value={userProfile.email} onChange={(event) => updateUserProfile("email", event.target.value)} />
                  </label>
                  <label>
                    Password
                    <input type="password" value={userProfile.password ?? ""} onChange={(event) => updateUserProfile("password", event.target.value)} />
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
                    <textarea rows={4} value={userProfile.notes} onChange={(event) => updateUserProfile("notes", event.target.value)} />
                  </label>
                  {userFeedback && <p className={userSaved ? "form-feedback success" : "form-feedback error"}>{userFeedback}</p>}
                  <button className="button" type="submit"><Save size={18} /> Create account</button>
                </form>
              ) : (
                <form className="dashboard-form auth-form" onSubmit={handleUserLogin}>
                  <div className="panel-heading">
                    <p className="eyebrow">User login</p>
                    <h2>Log in to download learning resources.</h2>
                  </div>
                  <label>
                    Email
                    <input type="email" value={userLogin.email} onChange={(event) => setUserLogin((current) => ({ ...current, email: event.target.value }))} />
                  </label>
                  <label>
                    Password
                    <input type="password" value={userLogin.password} onChange={(event) => setUserLogin((current) => ({ ...current, password: event.target.value }))} />
                  </label>
                  {userFeedback && <p className={userSaved ? "form-feedback success" : "form-feedback error"}>{userFeedback}</p>}
                  <div className="form-actions-inline">
                    <button className="button" type="submit"><UserRound size={18} /> Log in</button>
                    <button className="button light" type="button" onClick={handleUserLogout}>Sign out</button>
                  </div>
                </form>
              )}
            </section>

            <section className="learning-access-surface">
              <div className="panel-heading">
                <p className="eyebrow">Learning resources</p>
                <h2>{userSaved ? `${userProfile.name || "Logged-in user"} is logged in` : "Log in to access downloads"}</h2>
              </div>
              <div className="download-list">
                {userSaved && permittedResources.length > 0 ? (
                  permittedResources.map((resource) => (
                    <article className="download-card" key={resource.id}>
                      <div>
                        <strong>{resource.title}</strong>
                        <span>{resource.format}</span>
                        <p>{resource.summary}</p>
                      </div>
                      <a className="button light" href={resource.downloadUrl} download={resource.fileName}>
                        <Download size={18} /> Download
                      </a>
                    </article>
                  ))
                ) : (
                  <p className="empty-state compact">Create an account, then log in with your password to download approved staff-training resources.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </section>
    </>
  );
}
