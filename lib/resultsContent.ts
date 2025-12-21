import { ProfileSegment } from "./pagePlan";

export interface SectionContent {
  heading: string;
  subheading: string;
  body: string;
  bullets: string[];
}

export interface ResultsContent {
  result_snapshot: Record<ProfileSegment, SectionContent>;
  who_we_are: SectionContent;
  what_happens: SectionContent;
  coaching_program: SectionContent;
  why_this_matters: SectionContent;
  program_snapshot: SectionContent;
  investment: SectionContent;
  who_this_is_for: SectionContent;
  ways_to_move_forward: SectionContent;
  final_nudge: Record<ProfileSegment, SectionContent>;
}

export const resultsContent: ResultsContent = {
  result_snapshot: {
    builder_stuck: {
      heading: "You're at the start. Your next move matters.",
      subheading: " ",
      body: "Based on your quiz results, you're still early in the journey—exploring if this idea is worth pursuing. That's the right place to begin.\n\nMost founders get stuck here: they spend 6–12 months reading, researching, and perfecting their idea… only to discover it doesn't work when they finally put it in front of real customers. By then, they've lost momentum and burned time and money.\n\nThis program helps you skip that trap by choosing one clear customer problem and designing a small, simple test you can run in the next 30 days.",
      bullets: [],
    },
    builder_learning: {
      heading: "You're on the right track. Now you need a proven system.",
      subheading: " ",
      body: "Based on your quiz results, you've started validating your idea—talking to people, building things, maybe running early tests. You're taking this seriously.\n\nThe risk now isn't effort; it's randomness. Without a clear sequence, it's hard to know what to do next, what to measure, or whether you're wasting time.\n\nThis program gives you a step-by-step MVP system so every week moves you closer to a real offer, real customers, and real decisions.",
      bullets: [],
    },
    builder_ready: {
      heading: "You're closer than you think. It's time to prove it.",
      subheading: " ",
      body: "Based on your quiz results, you've already done the hard part—you're building, testing, or even selling. You have momentum and you feel the urgency.\n\nAt this stage, more theory won't help. Guessing will cost you months of work and missed revenue. What you need now is a focused 12-week plan to run the right tests, with the right customers, in the right order.\n\nThis program is built to compress 6–12 months of trial and error into one MVP cycle so you can decide—confidently—whether to double down, pivot, or park.",
      bullets: [],
    },
  },
  who_we_are: {
    heading: "Hi! I'm Carlo, Founder of Startup PH Training",
    subheading: " ",
    body: "For over a decade, I've run hundreds of workshops and trained thousands of founders and innovators across Asia. I'm a Top 250 Founder Institute Global Mentor, teach at SoFA Design Institute, and spent nearly a decade in HSBC's HR Learning & Development building training systems at scale.\n\nI've seen what separates founders who ship from founders who stall. It's not better ideas—it's better process.\n\nMost founders at your stage don't need more theory. You need a proven system to test faster, a structured methodology to de-risk your next moves, and a community to accelerate through the roadblocks you can't see yet.",
    bullets: [],
  },
  what_happens: {
    heading: "Here's exactly what happens",
    subheading: "Day 1: Build Your MVP (8-hour workshop)",
    body: "You'll leave with a working, testable MVP—not a concept, an actual clickable product focused on a real customer problem you've already validated. We use AI tools (ChatGPT, Claude, v0, Cursor) to compress 4-6 weeks of development into 8 hours.",
    bullets: [
      "Customer problem statement validated against your interviews",
      "Core feature set prioritized using ICE scoring",
      "Clickable prototype or no-code MVP",
      "First test script ready to run Monday",
    ],
  },
  coaching_program: {
    heading: "Weeks 2-12: Test, Refine, Build Systems (12-week coaching)",
    subheading: " ",
    body: "Weeks 1-4: Run structured experiments. Track metrics (activation rate, retention, willingness to pay). Weekly 90-minute coaching calls plus async support.\n\nWeeks 5-8: Get your first paying customers. Build foundational sales systems (outreach templates, pitch deck, pricing tiers, objection handling). We focus on closing deals, not just \"validating.\"\n\nWeeks 9-12: Scale what works. Build marketing systems (content engine, lead gen, referral loops). The goal is repeatable processes, not one-off wins.",
    bullets: [],
  },
  why_this_matters: {
    heading: " ",
    subheading: " ",
    body: " ",
    bullets: [" ", " ", " ", " "],
  },
  program_snapshot: {
    heading: " ",
    subheading: " ",
    body: " ",
    bullets: [" ", " ", " ", " "],
  },
  investment: {
    heading: " ",
    subheading: " ",
    body: " ",
    bullets: [" ", " ", " "],
  },
  who_this_is_for: {
    heading: " ",
    subheading: " ",
    body: " ",
    bullets: [" ", " ", " "],
  },
  ways_to_move_forward: {
    heading: " ",
    subheading: " ",
    body: " ",
    bullets: [],
  },
  final_nudge: {
    builder_stuck: {
      heading: " ",
      subheading: " ",
      body: " ",
      bullets: [],
    },
    builder_learning: {
      heading: " ",
      subheading: " ",
      body: " ",
      bullets: [],
    },
    builder_ready: {
      heading: " ",
      subheading: " ",
      body: " ",
      bullets: [],
    },
  },
};

