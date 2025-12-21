export type ProfileSegment = "builder_stuck" | "builder_learning" | "builder_ready";
export type CTAType = "discoveryCall" | "signupForm" | "contactUs";

export interface CTADefinition {
  label: string;
  url: string;
  isPrimary?: boolean;
}

export interface SectionContentPlaceholders {
  heading: string;
  subheading: string;
  body: string;
  bullets: string[];
  cta: CTADefinition | null;
}

export interface PageSection {
  id: string;
  name: string;
  purpose: string;
  segmentation: "profile_specific" | "shared";
  layoutNotes: string;
  contentPlaceholders: SectionContentPlaceholders;
}

export interface GlobalCTAs {
  discoveryCall: {
    label: string;
    url: string;
  };
  signupForm: {
    label: string;
    url: string;
  };
  contactUs: {
    label: string;
    url: string;
  };
}

export interface ProfileSegmentation {
  primaryCTA: CTAType;
  emphasizedCTA: CTAType;
  rationale: string;
}

export interface SegmentationLogic {
  builder_stuck: ProfileSegmentation;
  builder_learning: ProfileSegmentation;
  builder_ready: ProfileSegmentation;
  justification: string;
}

export interface PagePlan {
  sections: PageSection[];
  globalCTAs: GlobalCTAs;
  segmentationLogic: SegmentationLogic;
}

export const pagePlan: PagePlan = {
  sections: [
    {
      id: "result_snapshot",
      name: "Result Snapshot",
      purpose: "Display score, short diagnosis, and ONE primary CTA above the fold.",
      segmentation: "profile_specific",
      layoutNotes: "Score is big and prominent. Short diagnosis is visible without scroll. One primary button (CTA) based on profile.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [],
        cta: {
          label: " ",
          url: " ",
          isPrimary: true,
        },
      },
    },
    {
      id: "why_this_matters",
      name: "Why This Matters",
      purpose: "Explain why their score matters and what it costs them to stay still.",
      segmentation: "shared",
      layoutNotes: "Short, punchy block (not long-form). 3–4 bullets around lost time, money, opportunity.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [" ", " ", " ", " "],
        cta: null,
      },
    },
    {
      id: "program_snapshot",
      name: "Program Snapshot",
      purpose: "High-level steps of how the MVP + AI Program works (clarity → prototype → validation → decision).",
      segmentation: "shared",
      layoutNotes: "Timeline or 3–4 step layout. Can include a small, secondary CTA at the end (e.g., 'check fit').",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [" ", " ", " ", " "],
        cta: {
          label: " ",
          url: " ",
          isPrimary: false,
        },
      },
    },
    {
      id: "investment",
      name: "Investment",
      purpose: "Show pricing in a lean way.",
      segmentation: "shared",
      layoutNotes: "Show: Standard: ₱49,800, Founders Launch Rate: ₱24,950 (first 5 founders). 2–3 bullets of what's included (workshop + coaching + validation). Optionally reference Discovery Call / Signup as how to lock this in.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [" ", " ", " "],
        cta: null,
      },
    },
    {
      id: "who_this_is_for",
      name: "Who This Is For",
      purpose: "Filter in ideal behaviors and filter out obvious non-fits.",
      segmentation: "shared",
      layoutNotes: "Two mini-lists: 'Who this is for' and 'Who this is not for'. Behavior-based criteria only. Optional small CTA at bottom.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [" ", " ", " "],
        cta: null,
      },
    },
    {
      id: "ways_to_move_forward",
      name: "Ways to Move Forward",
      purpose: "Present all three options (Discovery Call, Signup, Contact) in one hub.",
      segmentation: "shared",
      layoutNotes: "3 cards or blocks: Discovery Call, Signup Form, Contact Us. One is visually emphasized as 'recommended' depending on profile. Use globalCTAs for URLs and labels.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [],
        cta: null,
      },
    },
    {
      id: "final_nudge",
      name: "Final Nudge",
      purpose: "Short closing section that reinforces that the quiz is a starting point and pushes one primary CTA again.",
      segmentation: "profile_specific",
      layoutNotes: "Very short. Repeats the same primary CTA as 'result_snapshot' for consistency.",
      contentPlaceholders: {
        heading: " ",
        subheading: " ",
        body: " ",
        bullets: [],
        cta: {
          label: " ",
          url: " ",
          isPrimary: true,
        },
      },
    },
  ],
  globalCTAs: {
    discoveryCall: {
      label: " ",
      url: "https://api.ghlsandbox.net/widget/booking/B7cMXh3yR0sMoOaaHiwV",
    },
    signupForm: {
      label: " ",
      url: "https://api.ghlsandbox.net/widget/form/VUBtDYBNuZuc9tttDPUS",
    },
    contactUs: {
      label: " ",
      url: "https://www.startupphtraining.com/contact",
    },
  },
  segmentationLogic: {
    builder_ready: {
      primaryCTA: "signupForm",
      emphasizedCTA: "signupForm",
      rationale: "They're closer to committing, so direct signup is appropriate.",
    },
    builder_learning: {
      primaryCTA: "discoveryCall",
      emphasizedCTA: "discoveryCall",
      rationale: "They need clarity + trust + plan, so discovery call helps build confidence.",
    },
    builder_stuck: {
      primaryCTA: "discoveryCall",
      emphasizedCTA: "discoveryCall",
      rationale: "Framed as a low-bar clarity session to reduce friction for early-stage founders.",
    },
    justification: "Only 'result_snapshot' and 'final_nudge' are profile_specific because they need personal diagnosis and tailored urgency. All other sections (why_this_matters, program_snapshot, investment, who_this_is_for, ways_to_move_forward) remain shared because the core value proposition, program structure, pricing, and filtering criteria are universal across all founder stages.",
  },
};

