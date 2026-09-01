/* Careers content — roles, how-we-work principles, hiring process.
   Layout lives in SiteA-Careers.jsx; this file is copy only, so a new role
   is a new entry in ROLES and nothing else.

   Role shape:
     slug        URL segment → /careers/<slug>
     title       Displayed and used as the mailto subject
     team        Eyebrow + list grouping
     location    Displayed as a meta chip and in JobPosting structured data
     type        "Full-time" | "Part-time" | "Contract"
     reportsTo   Optional meta chip
     posted      ISO date — used for JobPosting.datePosted (SEO) and the "posted" line
     salary      Optional { min, max, currency? } — annual. Rendered as a chip and
                 emitted as JobPosting.baseSalary. UK ads with a range get
                 markedly more applications; leave null only if we truly can't.
     closes      Optional ISO date → JobPosting.validThrough
     summary     2–3 sentence intro paragraph at the top of the role page
     sections    Ordered list of { h, intro?, items: [{ lead, body }] }.
                 A section may also carry `groups` (sub-headed item lists)
                 instead of `items` — see "What we're looking for" below. */

// Where applications land. Prefilled as a mailto with the role title in the
// subject so nothing gets lost in a shared inbox.
export const APPLY_EMAIL = "harry@satorusgroup.com";

export const ROLES = [
  {
    slug: "ai-engineer",
    title: "AI Engineer",
    team: "Engineering",
    location: "London",
    type: "Full-time",
    reportsTo: "CTO",
    posted: "2026-09-01",
    salary: null,
    closes: null,
    stack: ["React", "Python", "Agentic AI", "RAG"],
    summary:
      "Work directly with the CTO on a platform that's already carrying real customer workloads. You'll own the calls on data models, concurrency, and cost-per-query that we'll live with for years, and build the AI systems that make analysts trust Sidney's output on the first read.",
    sections: [
      {
        h: "What you'll do",
        items: [
          {
            lead: "Architect and iterate.",
            body: "Work directly with the CTO to turn business objectives into technical reality, on a platform that's already carrying real customer workloads.",
          },
          {
            lead: "Scale what's working.",
            body: "Take core services from “handles our current clients” to “handles an order of magnitude more” without a rewrite. You'll own the calls on data models, concurrency, and cost-per-query that we'll live with for years.",
          },
          {
            lead: "Raise the quality bar.",
            body: "Full-stack ownership across React and Python. Every change ships against live users, so testing, observability, and failure handling aren't a later phase. They're how you build.",
          },
          {
            lead: "Push the AI frontier.",
            body: "Build and refine AI agents, RAG pipelines, memory, and prompt systems that automate genuinely complex intelligence workflows, and make them reliable enough that analysts trust the output on the first read.",
          },
          {
            lead: "Run it in production.",
            body: "Support live deployments, optimise performance, and troubleshoot mission-critical issues in real time. What you build, you operate.",
          },
          {
            lead: "Build the culture.",
            body: "Help define what “excellence” means at Satorus as we scale from founding team to global disruptor.",
          },
        ],
      },
      {
        h: "What we're looking for",
        groups: [
          {
            h: "The person",
            items: [
              {
                lead: "Genuinely fascinated by this problem.",
                body: "Intelligence work: what it's for, who relies on it, why manual analysis is a bottleneck worth destroying. You don't need a background in the industry, but you should be the kind of person who reads about it unprompted.",
              },
              {
                lead: "You've taken something past the prototype.",
                body: "Not just “I've built cool stuff”. You've had a system in front of real users, watched it strain, and fixed it properly. You know the difference between a demo and a product because you've made that transition yourself.",
              },
              {
                lead: "Comfortable operating on a moving platform.",
                body: "You can improve architecture, pay down debt, and ship new capability without breaking what clients already rely on. That's a specific skill, and we'd rather hire someone who has it than someone who's only started from scratch.",
              },
              {
                lead: "You communicate as well as you build.",
                body: "At this size, engineering decisions are business decisions. You can explain a technical trade-off to someone non-technical without dumbing it down, and write things down so they don't have to be re-explained.",
              },
              {
                lead: "Radical candour.",
                body: "We value honesty over politeness. You can challenge an idea and take the challenge back without ego.",
              },
            ],
          },
          {
            h: "Technical skills",
            items: [
              {
                lead: "Stack.",
                body: "Professional proficiency in React and Python.",
              },
              {
                lead: "Scale and robustness.",
                body: "Demonstrable experience designing systems that handle real production load. You can talk concretely about a bottleneck you found, a failure mode you designed around, or a migration you ran without downtime.",
              },
              {
                lead: "AI focus.",
                body: "Hands-on with agentic AI development, RAG, memory, and prompt engineering, including how you evaluate and monitor these systems, not just build them.",
              },
              {
                lead: "Core fundamentals.",
                body: "Strong grasp of data structures, algorithms, and system design.",
              },
              {
                lead: "Bonus.",
                body: "Familiarity with AI security.",
              },
            ],
          },
        ],
      },
    ],
  },
];

export const roleBySlug = (slug) => ROLES.find((r) => r.slug === slug) || null;

/* "How we work" — the careers-page manifest. Every line here is lifted from
   how the roles themselves are written, so the page and the job description
   say the same thing. Rendered as a numbered list, matching the Team finale. */
export const PRINCIPLES = [
  {
    lead: "Every change ships against live users.",
    body: "Sidney is carrying real customer workloads today. Testing, observability, and failure handling aren't a later phase; they're how we build.",
  },
  {
    lead: "What you build, you operate.",
    body: "The person who designs a system supports it in production. Nothing gets thrown over a wall.",
  },
  {
    lead: "Engineering decisions are business decisions.",
    body: "At this size they're the same thing. We explain trade-offs plainly to non-technical people, and we write things down so they don't need re-explaining.",
  },
  {
    lead: "Radical candour.",
    body: "Honesty over politeness. Challenge an idea, take the challenge back, and leave ego out of it.",
  },
];

/* Hiring process — shown on both pages so a candidate knows what they're
   signing up for before they write to us. Keep to the truth: four steps,
   founders in the room, decision within days of the last conversation. */
export const PROCESS = [
  {
    h: "Write to us",
    body: "An email with a few lines on what you've built and why this problem interests you. A CV or a link to your work is enough; no cover letter required.",
  },
  {
    h: "A conversation with the CTO",
    body: "Forty-five minutes on your background, how you think about systems, and what you'd want to know about ours.",
  },
  {
    h: "A technical deep-dive",
    body: "We go into something you've shipped: the bottleneck you found, the failure mode you designed around, how you'd do it differently now. Then we work a real Satorus problem together.",
  },
  {
    h: "Meet the founders",
    body: "The final conversation is about the company, not the code. Ask us anything. We'll give you a decision within a few days.",
  },
];
