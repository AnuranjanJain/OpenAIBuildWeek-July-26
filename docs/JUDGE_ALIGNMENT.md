# Judge research and product implications

This document records public signals, not private preferences. None of the judges has published a Build Week scoring wishlist beyond the official criteria. The product implications below are reasoned inferences from their public work, interviews, writing, and products.

## Thibault Sottiaux — Product, platform, and useful agency

### Public signals

- In an OpenAI Forum conversation, Sottiaux described Codex expanding beyond software engineering into knowledge work, personal productivity, and complex multi-step tasks. The discussion emphasized reducing friction, coordinating work across tools, and enterprise trust and security.
- He described the product direction as persistent, goal-oriented workflows rather than one-shot chat answers.
- In a 2026 interview, he framed the broader direction as a personal agent that understands what people care about and becomes proactively useful.

Sources:

- https://forum.openai.com/public/videos/event-replay-codex-is-for-everyone-why-codex-matters-beyond-code-2026-05-13
- https://www.wired.com/story/model-behavior-interview-with-openai-codex-lead-tibo-sottiaux/

### Product inference

A strong entry should complete a meaningful workflow, remain understandable to non-experts, expose trust boundaries, and move the user from insight to action. A passive AI-generated dashboard is weaker than a product that helps someone finish real work.

### ProofGarden response

- The Proof Sprint turns analysis into a persistent four-week workflow.
- The learner chooses the goal and anchor project instead of surrendering direction to the model.
- Every claim links to public repository evidence.
- The export and Codex kickoff move the plan into the user's actual work environment.

## Kath Korevec — Product completeness, delight, and real implementation

### Public signals

- Korevec works on Codex and publicly describes a love for making products smoother and easier to use.
- She has argued that workflows feel incomplete when design is separated from implementation, advocating for designing in development.
- Her public examples favor shareable, end-to-end products, including a San Francisco event guide built and published with ChatGPT Sites.
- She repeatedly solicits user feedback and publicly tracks a very large feedback corpus.
- She has highlighted durable agent workflows that survive retries and messy real-world execution.

Sources:

- https://www.linkedin.com/company/resend
- https://nitter.kareem.one/simpsoka
- https://openai.com/build-week/

### Product inference

She is likely to notice whether the main flow is coherent, delightful, and genuinely implemented—not merely a polished mockup. Small playful details are useful when they reinforce state and usability.

### ProofGarden response

- The complete flow now runs from profile analysis through learner choice, action tracking, export, and source inspection.
- The progress plant blooms only when proof artifacts are completed; delight communicates real state.
- The product works without login and degrades gracefully under API limits.
- Desktop and mobile layouts are implemented and tested directly in the browser.

## Tara Seshan — Target user, differentiated value, and execution

### Public signals

- Seshan's product-review framework begins with an exact target user and insists that teams cannot advance until that answer is clear.
- She emphasizes understanding why now, the hypotheses behind an advantage, measurable criteria for winning, and how evidence changes the team's beliefs.
- She looks for builders who identify the bigger problem creatively and drag work across the finish line.
- In discussing effective Codex usage, she emphasized context, a definition of good, boundaries, output review, and human judgment.

Sources:

- https://review.firstround.com/podcast/lessons-from-stripe-on-adding-new-products-assessing-ideas-structuring-teams-and-tactics-for-product-reviews-tara-seshan-watershed-stripe/
- https://www.forbes.com/sites/the-prompt/2026/06/30/could-codex-be-the-answer-to-openais-problems/
- https://www.linkedin.com/in/tarstarr

### Product inference

The pitch needs a narrow user, a painful and current problem, a credible advantage, visible success criteria, and proof that the team finished the hard parts.

### ProofGarden response

- Target user: a developer learning with AI who has shipped projects but does not know which skill will create the most leverage next.
- Differentiation: recommendations begin with repository evidence and compound existing work.
- Success criteria: every week specifies artifacts and one proof condition.
- Human judgment: the learner chooses the focus and project and can inspect every evidence source.

## Leah Belsky — Agency, active learning, and equitable access

### Public signals

- Belsky has argued that building should become a core part of how students learn, solve problems, and shape what comes next—not enrichment available only to learners with special access.
- Her public education work highlights students using AI to build practical tools for peers and communities.
- OpenAI's education direction emphasizes active participation, Socratic guidance, confidence, teacher involvement, and learning rather than answer generation.
- She consistently frames students as shapers and teachers of the AI-enabled future.

Sources:

- https://edunewsletter.openai.com/p/a-commencement-address-to-the-chatgpt
- https://edunewsletter.openai.com/p/the-future-starts-in-this-room
- https://www.linkedin.com/posts/leahbelsky_today-were-proud-to-share-the-inaugural-activity-7457852685678047232-z8Zi
- https://openai.com/global-affairs/learning-accelerator/

### Product inference

An education entry should make the learner think and build, preserve agency, avoid doing the learning for them, show evidence of progress, and work without privileged institutional access.

### ProofGarden response

- The learner must choose what to strengthen and where to prove it.
- The Codex kickoff asks for predictions, small steps, explanation, and evidence rather than automatic completion.
- Progress means shipped artifacts, not time spent or content consumed.
- No account, private repository, or paid integration is required for the core experience.
- The sprint export is mentor-ready and supports human review.

## Peter Steinberger — Useful, agent-native, fun software

### Public signals

- Steinberger built OpenClaw around the idea of an agent that actually does things, can understand its own harness, and can modify its own software.
- He has emphasized making projects easy for agents to navigate rather than fighting the model's natural conventions.
- He treats documentation as part of a feature.
- He intentionally made OpenClaw fun and weird and celebrated how it lowered the barrier for non-programmers to become builders.
- His public workflow centers on agentic engineering, parallel action, rapid experimentation, and strong human product vision.

Sources:

- https://lexfridman.com/peter-steinberger-transcript/
- https://steipete.me/
- https://openai.com/index/harness-engineering/

### Product inference

He is likely to respond to software with a memorable personality, a real action loop, agent-readable architecture, and a demonstration that Codex was used as more than autocomplete.

### ProofGarden response

- The product creates an actionable Codex kickoff tied to a real repository.
- The repository includes architecture, setup, product decisions, tests, and judge-facing documentation.
- The blooming proof plant gives the product a distinctive personality while reinforcing the learning model.
- The key workflow is working software with graceful failure paths, not an agent-themed landing page.

## Combined product bar

The common denominator is not “add more AI.” It is:

1. Solve a precise human problem.
2. Complete the workflow.
3. Keep the human in control.
4. Make progress and trust inspectable.
5. Use Codex deeply and visibly.
6. Make the experience memorable enough to explain in one sentence.

ProofGarden's one-sentence story is: **It turns the projects you already shipped into a learner-controlled sprint where every new skill must produce proof.**
