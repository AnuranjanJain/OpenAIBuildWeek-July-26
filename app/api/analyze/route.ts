import { NextRequest, NextResponse } from "next/server";
import { buildEvidenceAnalysis } from "@/lib/analyze";
import { enhanceWithGpt } from "@/lib/gpt";
import { featuredProfile, featuredRepos } from "@/lib/featured";
import { fetchGitHubPortfolio } from "@/lib/github";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username") ?? "";
  try {
    const { profile, repos } = await fetchGitHubPortfolio(username);
    if (repos.length === 0) {
      return NextResponse.json(
        { error: "This profile has no original public repositories to analyze." },
        { status: 422 },
      );
    }
    const analysis = buildEvidenceAnalysis(profile, repos);
    return NextResponse.json(await enhanceWithGpt(analysis));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze this profile.";
    if (
      username.replace(/^@/, "").toLowerCase() === "anuranjanjain" &&
      message.includes("rate limit")
    ) {
      const fallback = buildEvidenceAnalysis(featuredProfile, featuredRepos);
      return NextResponse.json(
        await enhanceWithGpt({ ...fallback, source: "snapshot" }),
      );
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
