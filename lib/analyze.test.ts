import { describe, expect, it } from "vitest";
import { buildEvidenceAnalysis, scoreSkills } from "./analyze";
import type { RepoSummary } from "./types";

const repos: RepoSummary[] = [
  {
    name: "agent-console",
    url: "https://github.com/example/agent-console",
    description: "A Next.js interface for an OpenAI agent",
    language: "TypeScript",
    stars: 4,
    forks: 0,
    topics: ["nextjs", "openai", "agents"],
    updatedAt: new Date().toISOString(),
  },
  {
    name: "worker-api",
    url: "https://github.com/example/worker-api",
    description: "FastAPI backend",
    language: "Python",
    stars: 1,
    forks: 0,
    topics: ["fastapi"],
    updatedAt: new Date().toISOString(),
  },
];

describe("portfolio evidence analysis", () => {
  it("scores matched skills above unsupported skills", () => {
    const scores = scoreSkills(repos);
    const frontend = scores.find((skill) => skill.id === "frontend");
    const testing = scores.find((skill) => skill.id === "testing");
    expect(frontend?.score).toBeGreaterThan(testing?.score ?? 0);
    expect(frontend?.evidence[0].repo).toBe("agent-console");
  });

  it("builds a four-week roadmap anchored to a real repository", () => {
    const result = buildEvidenceAnalysis(
      {
        login: "example",
        name: "Example Dev",
        avatar_url: "",
        html_url: "https://github.com/example",
        bio: null,
        public_repos: 2,
      },
      repos,
    );
    expect(result.roadmap).toHaveLength(4);
    expect(repos.map((repo) => repo.name)).toContain(result.roadmap[0].project);
    expect(result.source).toBe("github");
  });
});
