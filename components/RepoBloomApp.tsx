"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { demoAnalysis } from "@/lib/demo";
import type { ProfileAnalysis, Skill } from "@/lib/types";

const nodePositions = [
  { x: 50, y: 18 },
  { x: 78, y: 38 },
  { x: 70, y: 72 },
  { x: 34, y: 79 },
  { x: 17, y: 48 },
  { x: 42, y: 48 },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.88c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.55 9.55 0 0 1 12 6.82c.85 0 1.71.12 2.51.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

function SkillConstellation({ skills }: { skills: Skill[] }) {
  return (
    <div className="constellation" aria-label="Interactive skill evidence map">
      <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M50 18 L78 38 L70 72 L34 79 L17 48 L50 18 M17 48 L42 48 L78 38 M42 48 L70 72" />
      </svg>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      {skills.map((skill, index) => {
        const position = nodePositions[index] ?? nodePositions[0];
        return (
          <button
            className={`skill-node ${skill.score < 45 ? "growth-node" : ""}`}
            key={skill.id}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={skill.evidence.map((item) => `${item.repo}: ${item.detail}`).join("\n") || "Growth opportunity"}
          >
            <span>{skill.score}</span>
            {skill.label}
          </button>
        );
      })}
      <div className="map-center">
        <span>portfolio</span>
        <strong>evidence</strong>
      </div>
    </div>
  );
}

export function RepoBloomApp() {
  const [username, setUsername] = useState("AnuranjanJain");
  const [analysis, setAnalysis] = useState<ProfileAnalysis>(demoAnalysis);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedFocus, setSelectedFocus] = useState(demoAnalysis.focusAreas[0]);
  const [selectedProject, setSelectedProject] = useState(demoAnalysis.projects[0]?.name ?? "");
  const [completedProofs, setCompletedProofs] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const activeRoadmap = useMemo(
    () => analysis.roadmap.find((item) => item.week === activeWeek) ?? analysis.roadmap[0],
    [activeWeek, analysis],
  );

  const evidenceLedger = useMemo(() => {
    const seen = new Set<string>();
    return analysis.skills
      .flatMap((skill) =>
        skill.evidence.map((evidence) => ({ ...evidence, skill: skill.label })),
      )
      .filter((evidence) => {
        const key = `${evidence.repo}:${evidence.skill}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [analysis.skills]);

  const totalProofs = analysis.roadmap.reduce(
    (total, week) => total + week.deliverables.length,
    0,
  );
  const progress = totalProofs ? Math.round((completedProofs.length / totalProofs) * 100) : 0;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(`repobloom:${analysis.profile.username}:proofs`);
      setCompletedProofs(saved ? (JSON.parse(saved) as string[]) : []);
    } catch {
      setCompletedProofs([]);
    }
  }, [analysis.profile.username]);

  async function analyzeProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/analyze?username=${encodeURIComponent(username)}`);
      const result = (await response.json()) as ProfileAnalysis | { error: string };
      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Analysis failed.");
      }
      setAnalysis(result);
      setActiveWeek(1);
      setSelectedFocus(result.focusAreas[0] ?? "");
      setSelectedProject(result.projects[0]?.name ?? result.roadmap[0]?.project ?? "");
      document.getElementById("growth-plan")?.scrollIntoView({ behavior: "smooth" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Analysis failed.");
    } finally {
      setLoading(false);
    }
  }

  function proofKey(week: number, deliverable: string) {
    return `${week}:${deliverable}`;
  }

  function toggleProof(week: number, deliverable: string) {
    const key = proofKey(week, deliverable);
    setCompletedProofs((current) => {
      const next = current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key];
      window.localStorage.setItem(
        `repobloom:${analysis.profile.username}:proofs`,
        JSON.stringify(next),
      );
      return next;
    });
  }

  function sprintMarkdown() {
    const weeks = analysis.roadmap
      .map(
        (week) => `## Week ${week.week}: ${week.title}\n\n${week.outcome}\n\n${week.deliverables
          .map((item) => `- [ ] ${item}`)
          .join("\n")}\n\n**Proof:** ${week.proof}`,
      )
      .join("\n\n");

    return `# RepoBloom Proof Sprint\n\n**Learner:** ${analysis.profile.name} (@${analysis.profile.username})\n**Focus:** ${selectedFocus}\n**Anchor project:** ${selectedProject}\n\n## Growth thesis\n\n${analysis.headline}\n\n${analysis.summary}\n\n${weeks}\n\n---\nGenerated by RepoBloom with public GitHub evidence. The learner owns the final decisions.`;
  }

  function downloadSprint() {
    const blob = new Blob([sprintMarkdown()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.profile.username}-repobloom-sprint.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyCodexKickoff() {
    const project = analysis.projects.find((item) => item.name === selectedProject);
    const prompt = `Work with me as a Socratic engineering coach on ${selectedProject}. Repository: ${project?.url ?? analysis.profile.profileUrl}. My learning focus is ${selectedFocus}. First inspect the repository and establish a measurable baseline. Do not replace my reasoning or immediately write the whole solution. Ask me to predict the approach, then help me implement one small step at a time. Every claim must be backed by a test, benchmark, diff, or runnable demo. Preserve existing behavior unless we explicitly agree to change it. End each step by asking me to explain the decision and record the evidence.`;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const initials = analysis.profile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <main>
      <nav className="nav shell">
        <a className="brand" href="#top" aria-label="RepoBloom home">
          <span className="brand-mark">R</span>
          <span>RepoBloom</span>
        </a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#growth-plan">Growth plan</a>
          <span className="track-pill">OpenAI Build Week · Education</span>
        </div>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span /> Evidence-first learning</div>
          <h1>Grow from what<br />you’ve already <em>built.</em></h1>
          <p>
            RepoBloom reads the work in your GitHub—not a self-reported quiz—and turns it into a
            focused learning sprint with proof at every step.
          </p>
          <form className="analyze-form" onSubmit={analyzeProfile}>
            <div className="input-wrap">
              <GithubIcon />
              <span>github.com/</span>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                aria-label="GitHub username"
                spellCheck={false}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Reading evidence…" : "Map my growth"}
              {!loading && <ArrowIcon />}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <div className="trust-row">
            <span>No login required</span><i />
            <span>Public repos only</span><i />
            <span>Built with GPT-5.6</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-label">A living map of your work</div>
          <SkillConstellation skills={analysis.skills} />
          <div className="evidence-float evidence-one">
            <span className="evidence-icon">↗</span>
            <div><small>Strongest signal</small><strong>{[...analysis.skills].sort((a, b) => b.score - a.score)[0].label}</strong></div>
          </div>
          <div className="evidence-float evidence-two">
            <span className="evidence-icon">＋</span>
            <div><small>Next unlock</small><strong>{[...analysis.skills].sort((a, b) => a.score - b.score)[0].label}</strong></div>
          </div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="shell proof-grid">
          <div><strong>{analysis.stats.repositories}</strong><span>public repositories</span></div>
          <div><strong>{analysis.stats.activeLanguages}</strong><span>active languages</span></div>
          <div><strong>{analysis.stats.evidencePoints}</strong><span>skill evidence links</span></div>
          <div><strong>{analysis.stats.recentProjects}</strong><span>recent projects</span></div>
        </div>
      </section>

      <section className="how-section shell" id="how">
        <div className="section-heading">
          <div><span className="section-number">01</span><p>From repositories to direction</p></div>
          <h2>Learning advice that<br /><em>shows its work.</em></h2>
        </div>
        <div className="steps-grid">
          <article>
            <span className="step-icon">⌁</span>
            <small>01 · Observe</small>
            <h3>Read real signals</h3>
            <p>Languages, topics, recency, and project context become evidence—not vanity metrics.</p>
          </article>
          <article>
            <span className="step-icon">◎</span>
            <small>02 · Reason</small>
            <h3>Find the leverage</h3>
            <p>GPT-5.6 connects strengths and gaps to the projects where new skills will matter most.</p>
          </article>
          <article>
            <span className="step-icon">↗</span>
            <small>03 · Prove</small>
            <h3>Ship visible growth</h3>
            <p>Every sprint ends with a commit, test, benchmark, or demo others can actually inspect.</p>
          </article>
        </div>
      </section>

      <section className="analysis-section" id="growth-plan">
        <div className="shell">
          <div className="profile-row">
            <div className="profile-identity">
              {analysis.profile.avatarUrl ? (
                // GitHub avatars are user-selected remote media; a plain img keeps arbitrary hosts supported.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={analysis.profile.avatarUrl} alt="" />
              ) : <span className="avatar-fallback">{initials}</span>}
              <div>
                <small>
                  {analysis.source === "demo"
                    ? "Example profile"
                    : analysis.source === "snapshot"
                      ? "Verified portfolio snapshot"
                      : "Live GitHub analysis"}
                </small>
                <h2>{analysis.profile.name}</h2>
                <a href={analysis.profile.profileUrl} target="_blank" rel="noreferrer">@{analysis.profile.username}</a>
              </div>
            </div>
            <div className="model-badge"><span /> Synthesized by {analysis.generatedBy}</div>
          </div>

          <div className="insight-grid">
            <div className="insight-copy">
              <span className="section-number light">02</span>
              <p className="mini-label">Your growth thesis</p>
              <h2>{analysis.headline}</h2>
              <p>{analysis.summary}</p>
              <div className="focus-list">
                {analysis.focusAreas.map((area, index) => (
                  <span key={area}><b>0{index + 1}</b>{area}</span>
                ))}
              </div>
            </div>
            <div className="skill-panel">
              <div className="panel-title"><span>Evidence map</span><small>Hover nodes for sources</small></div>
              <SkillConstellation skills={analysis.skills} />
            </div>
          </div>

          <div className="control-room">
            <div className="control-intro">
              <span className="control-kicker">Learner in the loop</span>
              <h3>AI recommends.<br /><em>You decide.</em></h3>
              <p>
                Keep the plan honest by choosing the capability you care about and the real project
                where you want to prove it.
              </p>
            </div>
            <label>
              <span>What do you want to strengthen?</span>
              <select value={selectedFocus} onChange={(event) => setSelectedFocus(event.target.value)}>
                {analysis.focusAreas.map((area) => <option key={area}>{area}</option>)}
              </select>
            </label>
            <label>
              <span>Where will you prove it?</span>
              <select value={selectedProject} onChange={(event) => setSelectedProject(event.target.value)}>
                {analysis.projects.map((project) => (
                  <option key={project.name} value={project.name}>{project.name}</option>
                ))}
              </select>
            </label>
            <div className="control-outcome">
              <small>Your contract</small>
              <strong>Build {selectedFocus.toLowerCase()} into {selectedProject}</strong>
              <span>Success must be visible in the repository.</span>
            </div>
          </div>

          <div className="roadmap-block">
            <div className="roadmap-title">
              <div><span className="section-number light">03</span><p>Four-week proof sprint</p></div>
              <div className="roadmap-heading-wrap">
                <div className="progress-badge"><span>{progress}%</span> proof complete</div>
                <h2>Don’t collect tutorials.<br /><em>Compound your work.</em></h2>
              </div>
            </div>
            <div className="week-tabs" role="tablist" aria-label="Roadmap weeks">
              {analysis.roadmap.map((item) => (
                <button
                  key={item.week}
                  className={activeWeek === item.week ? "active" : ""}
                  onClick={() => setActiveWeek(item.week)}
                  role="tab"
                  aria-selected={activeWeek === item.week}
                >
                  <span>Week {item.week}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </div>
            {activeRoadmap && (
              <article className="week-detail">
                <div className="week-main">
                  <small>Outcome</small>
                  <h3>{activeRoadmap.outcome}</h3>
                  <span className="project-chip">↳ Upgrade: {selectedProject || activeRoadmap.project}</span>
                </div>
                <div className="deliverables">
                  <small>Ship these artifacts</small>
                  {activeRoadmap.deliverables.map((item) => {
                    const key = proofKey(activeRoadmap.week, item);
                    const complete = completedProofs.includes(key);
                    return (
                      <button
                        key={item}
                        className={complete ? "complete" : ""}
                        onClick={() => toggleProof(activeRoadmap.week, item)}
                        aria-pressed={complete}
                      >
                        <span>{complete ? "✓" : "○"}</span>{item}
                      </button>
                    );
                  })}
                </div>
                <div className="proof-card">
                  <small>Proof condition</small>
                  <p>{activeRoadmap.proof}</p>
                </div>
              </article>
            )}
          </div>

          <div className="proof-workspace">
            <div className={`bloom-card bloom-stage-${Math.min(4, Math.floor(progress / 25))}`}>
              <div className="bloom-copy">
                <small>Living progress</small>
                <strong>{progress === 100 ? "Your proof is in full bloom." : "Proof makes the plan grow."}</strong>
                <p>{completedProofs.length} of {totalProofs} artifacts recorded</p>
              </div>
              <div className="plant" aria-hidden="true">
                <span className="flower flower-one" />
                <span className="flower flower-two" />
                <span className="leaf leaf-one" />
                <span className="leaf leaf-two" />
                <span className="stem" />
                <span className="soil" />
              </div>
            </div>
            <div className="action-card">
              <span className="control-kicker">Move from plan to action</span>
              <h3>Take the sprint with you.</h3>
              <p>
                Export a mentor-ready learning contract or start a bounded, evidence-first Codex
                session in the repository you chose.
              </p>
              <div className="action-buttons">
                <button onClick={downloadSprint}>Download sprint brief <span>↓</span></button>
                <button className="secondary" onClick={copyCodexKickoff}>
                  {copied ? "Kickoff copied" : "Copy Codex kickoff"} <span>{copied ? "✓" : "↗"}</span>
                </button>
              </div>
              <small className="action-note">No account required · Progress stays in this browser</small>
            </div>
          </div>

          <div className="evidence-ledger">
            <div className="ledger-heading">
              <div><span className="section-number light">04</span><p>Evidence ledger</p></div>
              <h3>No mystery score.<br /><em>Inspect the receipts.</em></h3>
            </div>
            <div className="ledger-grid">
              {evidenceLedger.map((evidence) => {
                const project = analysis.projects.find((item) => item.name === evidence.repo);
                return (
                  <a
                    key={`${evidence.repo}:${evidence.skill}`}
                    href={project?.url ?? `${analysis.profile.profileUrl}?tab=repositories`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <small>{evidence.skill}</small>
                    <strong>{evidence.repo}</strong>
                    <span>{evidence.detail || "Repository signal"}</span>
                    <b>View source ↗</b>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section shell">
        <span className="cta-orbit" />
        <small>Your history is not a résumé. It’s a starting point.</small>
        <h2>What will your repositories<br /><em>prove next?</em></h2>
        <button onClick={() => document.getElementById("top")?.scrollIntoView({ behavior: "smooth" })}>
          Map another profile <ArrowIcon />
        </button>
      </section>

      <footer className="shell">
        <div className="brand"><span className="brand-mark">R</span><span>RepoBloom</span></div>
        <p>Built for OpenAI Build Week 2026 · Education</p>
        <p>Public GitHub evidence · No credentials stored</p>
      </footer>
    </main>
  );
}
