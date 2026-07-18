export type Evidence = {
  repo: string;
  detail: string;
};

export type Skill = {
  id: string;
  label: string;
  category: "Build" | "Intelligence" | "Systems" | "Delivery";
  score: number;
  evidence: Evidence[];
};

export type RepoSummary = {
  name: string;
  url: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
};

export type RoadmapWeek = {
  week: number;
  title: string;
  outcome: string;
  project: string;
  deliverables: string[];
  proof: string;
};

export type ProfileAnalysis = {
  profile: {
    username: string;
    name: string;
    avatarUrl: string;
    profileUrl: string;
    bio: string;
  };
  stats: {
    repositories: number;
    activeLanguages: number;
    evidencePoints: number;
    recentProjects: number;
  };
  headline: string;
  summary: string;
  skills: Skill[];
  focusAreas: string[];
  projects: RepoSummary[];
  roadmap: RoadmapWeek[];
  source: "github" | "snapshot" | "demo";
  generatedBy: "GPT-5.6" | "evidence engine";
};
