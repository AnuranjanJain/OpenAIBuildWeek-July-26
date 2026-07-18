# Devpost submission draft

## Project name

ProofGarden

## Tagline

Grow from what you have already built.

## Track

Education

## Inspiration

Developers do not lack learning content. They lack direction. Most roadmaps begin with a quiz, a job title, or a list of trending technologies, then prescribe new tutorial projects disconnected from everything the learner has already built.

We wanted to reverse that process. A developer's repositories contain a living record of interests, strengths, unfinished ideas, and production gaps. ProofGarden turns that record into a learning plan that compounds existing work.

## What it does

ProofGarden analyzes a public GitHub profile and builds an evidence-backed skill map. Every signal links back to repositories that support it. It then identifies the highest-leverage growth areas and creates a four-week proof sprint anchored to one of the developer's real projects.

The roadmap does not ask the learner to watch a course and tick a box. Each week ends with something other people can inspect: an evaluation dataset, automated test, benchmark, failure analysis, deployment, or reproducible demo.

The learner remains in control: they choose the capability and anchor project, check off only artifacts they have actually produced, and see the interface bloom as proof accumulates. They can export a mentor-ready learning contract or copy a bounded Socratic prompt that starts Codex inside the selected repository without asking it to replace their reasoning.

## How we built it

ProofGarden is a full-stack Next.js application. Its server route fetches public GitHub metadata and passes it through a deterministic evidence engine. This layer scores observable signals such as language, repository context, topics, stars, and recency.

When an OpenAI API key is available, GPT-5.6 receives the compact evidence bundle through the Responses API. Structured Outputs constrain the result to a growth thesis, three focus areas, and four project-specific weeks with explicit deliverables and proof conditions. The model is instructed never to claim a skill without repository evidence.

The interface is a responsive skill constellation and roadmap workspace designed to make the reasoning inspectable. A keyless deterministic mode and a verified featured-profile snapshot ensure judges can test the product even if external rate limits are exhausted.

## How we used Codex and GPT-5.6

Codex was the primary build partner from discovery through QA. It researched competing concepts, helped reject a crowded initial direction, shaped the product thesis, implemented the application, added tests, remediated dependency warnings, and validated the real browser experience.

GPT-5.6 powers the evidence-grounded synthesis layer. It connects observed strengths and gaps to a coherent learning sequence while a strict schema and deterministic fallback keep the output testable and reliable.

## Challenges we ran into

The central design challenge was preventing an AI learning coach from making attractive but unsupported claims. We solved this by separating factual extraction from synthesis: code owns the portfolio evidence, while GPT-5.6 reasons over that bounded evidence.

During browser testing, GitHub's anonymous shared rate limit was already exhausted. Instead of accepting a fragile demo, we added a verified snapshot fallback for the featured profile and kept the live API path for other users.

## Accomplishments we are proud of

- Every recommendation shows the repository evidence behind it.
- Roadmaps upgrade existing work instead of generating disposable exercises.
- Every week has a concrete proof condition.
- Learners choose the direction; the model does not make the final decision.
- Progress is saved locally and represented by completed artifacts rather than time spent.
- The product exports a usable sprint contract and a repository-specific Codex kickoff.
- The complete judge experience works without a login or API key.
- GPT-5.6 output is constrained by a strict product schema.
- The app has a polished, coherent desktop and mobile experience.

## What we learned

Personalization is not the same as asking more questions. Strong personalization can begin with observable work and stay honest about uncertainty. We also learned that resilience is part of product design: a hackathon demo that relies on two external APIs needs graceful degradation, not an error screen.

## What's next

- Read dependency manifests and READMEs for deeper evidence.
- Let learners challenge or correct inferred skills.
- Verify weekly progress from commits and pull requests.
- Compare multiple snapshots to show growth over time.
- Add educator cohorts for project-based computer science courses.
- Generate shareable evidence portfolios for mentors and recruiters.

## Submission checklist

- [x] Add public deployment URL: https://repobloom-build-week.asta-aflc.chatgpt.site/
- [x] Add public GitHub repository URL: https://github.com/AnuranjanJain/OpenAIBuildWeek-July-26
- [ ] Record and upload the public YouTube demo under three minutes.
- [ ] Explain Codex and GPT-5.6 in the demo audio.
- [ ] Add the `/feedback` Codex Session ID used for the core build.
- [ ] Confirm the repository license is visible.
- [ ] Test the deployed project in a private browser window.
