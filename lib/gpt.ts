import OpenAI from "openai";
import type { ProfileAnalysis } from "./types";

type GptEnhancement = Pick<ProfileAnalysis, "headline" | "summary" | "focusAreas" | "roadmap">;

const roadmapSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "summary", "focusAreas", "roadmap"],
  properties: {
    headline: { type: "string" },
    summary: { type: "string" },
    focusAreas: { type: "array", minItems: 3, maxItems: 3, items: { type: "string" } },
    roadmap: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["week", "title", "outcome", "project", "deliverables", "proof"],
        properties: {
          week: { type: "integer" },
          title: { type: "string" },
          outcome: { type: "string" },
          project: { type: "string" },
          deliverables: {
            type: "array",
            minItems: 3,
            maxItems: 3,
            items: { type: "string" },
          },
          proof: { type: "string" },
        },
      },
    },
  },
} as const;

export async function enhanceWithGpt(analysis: ProfileAnalysis): Promise<ProfileAnalysis> {
  if (!process.env.OPENAI_API_KEY) return analysis;

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const evidence = {
    profile: analysis.profile,
    skills: analysis.skills,
    projects: analysis.projects,
  };

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6",
      reasoning: { effort: "medium" },
      input: [
        {
          role: "developer",
          content:
            "You are RepoBloom, an evidence-first learning coach. Create a practical four-week growth sprint from observed GitHub evidence. Upgrade existing projects instead of inventing tutorial projects. Never claim a skill without repository evidence. Each week must create a testable artifact and a concrete proof condition. Be specific, concise, encouraging, and honest about gaps.",
        },
        {
          role: "user",
          content: `Create a focused growth analysis from this portfolio evidence:\n${JSON.stringify(evidence)}`,
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "repobloom_growth_plan",
          strict: true,
          schema: roadmapSchema,
        },
      },
    });

    const enhancement = JSON.parse(response.output_text) as GptEnhancement;
    return { ...analysis, ...enhancement, generatedBy: "GPT-5.6" };
  } catch (error) {
    console.error("GPT enhancement failed; using deterministic analysis.", error);
    return analysis;
  }
}
