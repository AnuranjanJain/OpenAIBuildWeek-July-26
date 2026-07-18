import type { ProfileAnalysis, RepoSummary, Skill } from "./types";

type PublicProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
};

type Signal = {
  id: string;
  label: string;
  category: Skill["category"];
  tokens: string[];
};

const signals: Signal[] = [
  {
    id: "frontend",
    label: "Product UI",
    category: "Build",
    tokens: ["typescript", "javascript", "react", "nextjs", "next.js", "vue", "svelte", "css"],
  },
  {
    id: "backend",
    label: "Backend APIs",
    category: "Systems",
    tokens: ["python", "fastapi", "django", "flask", "node", "express", "api", "go", "java"],
  },
  {
    id: "agents",
    label: "AI Agents",
    category: "Intelligence",
    tokens: ["agent", "agents", "agentic", "openai", "langchain", "langgraph", "mcp", "llm"],
  },
  {
    id: "data",
    label: "Data & RAG",
    category: "Intelligence",
    tokens: ["rag", "embedding", "embeddings", "vector", "pytorch", "tensorflow", "machine-learning", "data"],
  },
  {
    id: "testing",
    label: "Evaluation",
    category: "Delivery",
    tokens: ["test", "testing", "pytest", "vitest", "playwright", "evaluation", "evals", "benchmark"],
  },
  {
    id: "delivery",
    label: "Production",
    category: "Delivery",
    tokens: ["docker", "kubernetes", "devops", "ci", "github-actions", "vercel", "aws", "azure", "deployment"],
  },
];

const recentCutoff = Date.now() - 1000 * 60 * 60 * 24 * 120;

function repoText(repo: RepoSummary) {
  return [repo.name, repo.description, repo.language, ...repo.topics].join(" ").toLowerCase();
}

export function scoreSkills(repos: RepoSummary[]): Skill[] {
  return signals.map((signal) => {
    const matched = repos.filter((repo) => {
      const text = repoText(repo);
      return signal.tokens.some((token) => text.includes(token));
    });
    const points = matched.reduce((total, repo) => {
      const recent = new Date(repo.updatedAt).getTime() > recentCutoff ? 8 : 2;
      return total + 11 + Math.min(repo.stars * 2, 12) + recent;
    }, 0);

    return {
      id: signal.id,
      label: signal.label,
      category: signal.category,
      score: Math.min(94, Math.max(matched.length ? 28 : 12, points)),
      evidence: matched.slice(0, 3).map((repo) => ({
        repo: repo.name,
        detail: [repo.language, ...repo.topics.slice(0, 2)].filter(Boolean).join(" · "),
      })),
    };
  });
}

function strongestProject(repos: RepoSummary[], skill: Skill) {
  const tokens = signals.find((signal) => signal.id === skill.id)?.tokens ?? [];
  return (
    repos.find((repo) => tokens.some((token) => repoText(repo).includes(token))) ?? repos[0]
  );
}

export function buildEvidenceAnalysis(
  profile: PublicProfile,
  repos: RepoSummary[],
): ProfileAnalysis {
  const skills = scoreSkills(repos);
  const sorted = [...skills].sort((a, b) => b.score - a.score);
  const growth = [...skills].sort((a, b) => a.score - b.score);
  const anchor = strongestProject(repos, sorted[0]);
  const target = growth[0];
  const focusAreas = growth.slice(0, 3).map((skill) => skill.label);
  const languageCount = new Set(repos.map((repo) => repo.language).filter((x) => x !== "Other")).size;
  const evidencePoints = skills.reduce((total, skill) => total + skill.evidence.length, 0);
  const projectName = anchor?.name ?? "your strongest repository";

  return {
    profile: {
      username: profile.login,
      name: profile.name ?? profile.login,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url,
      bio: profile.bio ?? "Building in public on GitHub.",
    },
    stats: {
      repositories: profile.public_repos,
      activeLanguages: languageCount,
      evidencePoints,
      recentProjects: repos.filter((repo) => new Date(repo.updatedAt).getTime() > recentCutoff).length,
    },
    headline: `${sorted[0].label} is your edge. ${target.label} is your next unlock.`,
    summary: `Your public work shows the strongest evidence in ${sorted
      .slice(0, 2)
      .map((skill) => skill.label)
      .join(" and ")}. The fastest growth path is not another tutorial project—it is adding ${focusAreas
      .slice(0, 2)
      .join(" and ")} to ${projectName}.`,
    skills,
    focusAreas,
    projects: repos.slice(0, 6),
    roadmap: [
      {
        week: 1,
        title: "Map the evidence",
        outcome: `Define one measurable improvement for ${projectName}.`,
        project: projectName,
        deliverables: ["Baseline audit", "Success metric", "Small evaluation dataset"],
        proof: "Commit the baseline and record the result before changing the system.",
      },
      {
        week: 2,
        title: `Build ${target.label.toLowerCase()}`,
        outcome: `Add one production-shaped ${target.label.toLowerCase()} capability.`,
        project: projectName,
        deliverables: ["Working implementation", "Failure cases", "Automated check"],
        proof: "Show a failing case, the change, and the passing check in one pull request.",
      },
      {
        week: 3,
        title: "Stress the weak spots",
        outcome: "Test the project against realistic edge cases and document trade-offs.",
        project: projectName,
        deliverables: ["Edge-case suite", "Before/after result", "Decision note"],
        proof: "Publish results that include at least one limitation, not only successes.",
      },
      {
        week: 4,
        title: "Ship the proof",
        outcome: "Turn the upgraded project into a clear demonstration of mastery.",
        project: projectName,
        deliverables: ["Live demo", "Setup-ready README", "Architecture walkthrough"],
        proof: "A new user can reproduce the result from the repository in five minutes.",
      },
    ],
    source: "github",
    generatedBy: "evidence engine",
  };
}
