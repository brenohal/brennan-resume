// Flagship project. Every claim here was checked against the private repo's code and commit history
// (router/registry are 100% authored by Brennan; ~87% of the app/ layer). No repo link on purpose:
// the project is in live use, so it is offered as a walkthrough instead.
export interface FlowStep {
  title: string
  detail: string
  accent?: boolean
}

export const caseStudy = {
  eyebrow: 'Flagship project',
  title: 'AI-Driven Job Application Engine',
  // Resume wording, verbatim
  summary:
    'Engineered an AI-driven automation tool using LLM-based code generation to streamline job application workflows; integrated multi-provider LLM failover across Cerebras, Groq, OpenRouter, and DeepSeek.',
  flow: [
    { title: 'Job boards & ATS', detail: 'Greenhouse, Lever, Workday and more' },
    { title: 'Scan · score · tailor', detail: 'Rank roles, select the right CV content' },
    { title: 'LLM router', detail: 'Cerebras · Groq · OpenRouter · DeepSeek, with cooldown + failover', accent: true },
    { title: 'Application filler', detail: 'Fills each page, verifies every write, stops at Submit', accent: true },
    { title: 'Me, on my phone', detail: 'Notified when a form is ready; I review and submit' },
  ] as FlowStep[],
  problem:
    'Job hunting is repetitive: finding roles, tailoring a CV, and retyping the same answers into long, inconsistent application forms. Free-tier LLMs can do the thinking, but they rate-limit and disappear without warning.',
  built: [
    'An LLM router that spreads work across free-tier providers. A 429 puts a provider on cooldown until its limit resets, and a model that is refused is benched on its own instead of taking its whole provider down.',
    'An application filler that walks multi-page forms, including Workday, up to the final Submit, then hands off to me.',
    'Safety guards: every write is verified and scoped to the page and document it belongs to, with answer provenance, so it never guesses at a field or claims something untrue.',
    'A phone-friendly dashboard with a Today view, push notifications when a form is ready or a reply arrives, and remote access to the app’s browser.',
  ],
  result:
    'In active use for my own job search. Roughly 160 commits over two weeks, built with AI-assisted development (Claude Code).',
  stack: ['Node.js', 'Hono', 'React', 'TypeScript', 'Playwright', 'Web Push', 'LLM APIs', 'Claude Code'],
  note:
    'Private repository: I’m happy to walk through the code or a live demo on request. It builds on the open-source Career-Ops project (MIT); the LLM router, application filler, safety guards and phone dashboard are my work.',
}
