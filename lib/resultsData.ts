export interface ResultContent {
  heading: string;
  paragraphs: string[];
}

export const resultsData: Record<string, ResultContent> = {
  "builder-stuck": {
    heading: "You're at the start of something, and that's exactly where you should be.",
    paragraphs: [
      "Based on your quiz results, you're exploring whether this idea is worth pursuing. You're doing the right thing by researching first.",
      "But here's what most founders get wrong at this stage: They spend 6-12 months planning, researching, and perfecting their idea—reading books, taking courses, building pitch decks and trying to secure funding—only to discover their idea doesn't work when they finally test it with real customers.",
      "By then, they've lost momentum, burned through savings, or missed their window.",
      "There's a better way.",
    ],
  },
  "builder-learning": {
    heading: "You're making progress, and that momentum is valuable.",
    paragraphs: [
      "Based on your quiz results, you've started taking action and learning what works. This is a critical stage where many founders get stuck.",
      "The challenge at this point is knowing what to focus on next. Should you keep building features? Start marketing? Look for funding?",
      "Without clear direction, you risk spending months on the wrong priorities—building things customers don't want, or marketing to people who won't buy.",
      "You need a proven system to validate what matters most.",
    ],
  },
  "builder-ready": {
    heading: "You're ready to move fast, and that's your biggest advantage.",
    paragraphs: [
      "Based on your quiz results, you have the foundation in place to build and launch quickly. This is where execution speed matters most.",
      "The difference between success and failure at this stage often comes down to having the right process and support to validate quickly, iterate based on real feedback, and scale what works.",
      "Many founders with your readiness level still waste months trying to perfect everything before launching, when they could be learning from real customers instead.",
      "You're ready to build something people will actually use and pay for.",
    ],
  },
};

export function getResultSegment(score: number): string {
  if (score >= 70) {
    return "builder-ready";
  } else if (score >= 40) {
    return "builder-learning";
  } else {
    return "builder-stuck";
  }
}







