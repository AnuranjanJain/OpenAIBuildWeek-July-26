import type { RepoSummary } from "./types";

type GitHubProfile = {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

const headers: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "RepoBloom-Build-Week",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function githubFetch<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers, next: { revalidate: 900 } });
  if (!response.ok) {
    if (response.status === 404) throw new Error("GitHub profile not found.");
    if (response.status === 403) throw new Error("GitHub rate limit reached. Try again shortly.");
    throw new Error(`GitHub request failed (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export async function fetchGitHubPortfolio(username: string) {
  const safeUsername = username.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(safeUsername)) {
    throw new Error("Enter a valid GitHub username.");
  }

  const [profile, rawRepos] = await Promise.all([
    githubFetch<GitHubProfile>(`https://api.github.com/users/${safeUsername}`),
    githubFetch<GitHubRepo[]>(
      `https://api.github.com/users/${safeUsername}/repos?per_page=100&sort=updated&type=owner`,
    ),
  ]);

  const repos: RepoSummary[] = rawRepos
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? "No description provided.",
      language: repo.language ?? "Other",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics ?? [],
      updatedAt: repo.updated_at,
    }))
    .sort((a, b) => {
      const scoreA = a.stars * 4 + new Date(a.updatedAt).getTime() / 1e12;
      const scoreB = b.stars * 4 + new Date(b.updatedAt).getTime() / 1e12;
      return scoreB - scoreA;
    });

  return { profile, repos };
}
