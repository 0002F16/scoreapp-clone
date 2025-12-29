import { ProfileSegment } from "./pagePlan";

export interface DiagnosisContent {
  characteristics: string[];
  whatsWorking: string;
  whatsFragile: string;
  stageDescription: string;
}

export const diagnosisContent: Record<ProfileSegment, DiagnosisContent> = {
  builder_stuck: {
    characteristics: [
      "Clear that they want to build something, but unsure what to prioritize",
      "Thinking seriously about an idea, but without external validation yet",
      "Consuming advice, content, or inspiration — but not moving forward confidently",
      "Working largely in isolation or with limited feedback",
    ],
    whatsWorking: "What's working is intent. You care enough to explore this seriously.",
    whatsFragile: "What's fragile is direction.",
    stageDescription:
      "When builders are early, it's easy to confuse motion with progress. Without clear signals, effort often goes into the wrong places — not because the idea is bad, but because the problem hasn't been sharpened yet.\n\nThis stage often feels busy, but uncertain.",
  },
  builder_learning: {
    characteristics: [
      "Taken concrete steps beyond ideation",
      "Talked to potential users or explored the problem space",
      "Started shaping a solution, prototype, or plan",
      "Enough momentum to feel progress — but not enough certainty yet",
    ],
    whatsWorking: "What's working is movement. You're no longer just thinking.",
    whatsFragile: "What's fragile is signal quality.",
    stageDescription:
      "When builders reach this stage, it's easy to mistake activity for validation. Feedback exists, but it's often incomplete, biased, or hard to interpret. The risk isn't doing nothing — it's learning the wrong lessons.\n\nThis stage is where confidence can rise faster than clarity.",
  },
  builder_ready: {
    characteristics: [
      "Moved beyond pure ideation and early curiosity",
      "Invested real time, thought, or budget into the idea",
      "Started validating pieces of the problem or solution",
      "Some form of technical or operational capacity in place",
    ],
    whatsWorking: "What's working is momentum. You're not stuck at the starting line.",
    whatsFragile: "What's fragile is timing and sequencing.",
    stageDescription:
      "When builders reach this stage, decisions stop being easily reversible. Small assumptions harden quickly once you build, hire, or launch. What felt flexible a month ago can become expensive to change later.\n\nThis is usually the point where effort accelerates — but clarity doesn't always keep up.",
  },
};


