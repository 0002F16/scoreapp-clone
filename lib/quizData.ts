export interface Choice {
  text: string;
  points: number;
}

export interface Question {
  id: string;
  text: string;
  choices: Choice[];
  allowMultiple?: boolean; // For Q4 which is "select all"
}

export const questions: Question[] = [
  {
    id: "1",
    text: "Which best describes where you are right now?",
    choices: [
      { text: "I have an idea but haven't validated it yet", points: 0 },
      { text: "I've talked to some potential customers", points: 3 },
      { text: "I've built something but need to validate it", points: 5 },
      { text: "I'm actively testing with real customers", points: 8 },
      { text: "I have paying customers already", points: 10 },
    ],
  },
  {
    id: "2",
    text: "Have you set aside budget for building and launching your MVP?",
    choices: [
      { text: "Yes and it has been approved", points: 25 },
      { text: "Considering/planning to allocate", points: 12 },
      { text: "No, just exploring options", points: 0 },
      { text: "I'll bootstrap/self-fund as needed", points: 8 },
    ],
  },
  {
    id: "3",
    text: "When do you need to start on your idea?",
    choices: [
      { text: "Within 30 days - urgent", points: 18 },
      { text: "1-3 months - planning mode", points: 12 },
      { text: "3-6 months - exploring", points: 6 },
      { text: "6+ months or just researching", points: 0 },
    ],
  },
  {
    id: "4",
    text: "What have you already done to validate your idea? (select all)",
    allowMultiple: true,
    choices: [
      { text: "Customer interviews (5+ people)", points: 8 },
      { text: "Built prototype or mockup", points: 5 },
      { text: "Competitor analysis", points: 3 },
      { text: "Created pitch deck or business plan", points: 3 },
      { text: "Applied for grants/funding", points: 1 },
      { text: "Nothing yet - starting from scratch", points: 0 },
    ],
  },
  {
    id: "5",
    text: "What's your role in deciding whether to invest in this program?",
    choices: [
      { text: "I make the final decision", points: 15 },
      { text: "I'm a key influencer/recommender", points: 9 },
      { text: "I'm researching for someone else", points: 3 },
      { text: "Just exploring for personal learning", points: 0 },
    ],
  },
  {
    id: "6",
    text: "How much is this costing you monthly in lost revenue, wasted time, or missed opportunities?",
    choices: [
      { text: "₱50,000+ - significant impact", points: 12 },
      { text: "₱20,000-50,000 - moderate cost", points: 8 },
      { text: "₱5,000-20,000 - manageable but adding up", points: 4 },
      { text: "Under ₱5,000 or not sure yet", points: 0 },
    ],
  },
  {
    id: "7",
    text: "Do you have technical capacity to build?",
    choices: [
      { text: "Yes, I/we have technical co-founder or developer", points: 6 },
      { text: "I have access to tech experts or freelancers", points: 4 },
      { text: "No, I'll need to hire or learn no-code tools", points: 0 },
      { text: "Not sure yet", points: 0 },
    ],
  },
  {
    id: "8",
    text: "Are you a member of any business associations or chambers of commerce?",
    choices: [
      { text: "Yes, active member (attend events/engaged)", points: 6 },
      { text: "Yes, but not very active", points: 3 },
      { text: "No, but interested", points: 0 },
      { text: "No", points: 0 },
    ],
  },
  {
    id: "9",
    text: "Before enrolling in a program that helps you build a clickable prototype in 1 day, then validate it with real customers over 2-3 months... what matters most to you?",
    choices: [
      { text: "Seeing proof it works (case studies, testimonials)", points: 0 },
      { text: "Understanding the exact process and timeline", points: 0 },
      { text: "Knowing the total investment required", points: 0 },
      { text: "Getting started quickly with clear next steps", points: 0 },
    ],
  },
];

