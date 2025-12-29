"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScoreMeter } from "@/components/ui/ScoreMeter";
import { Typography } from "@/components/ui/Typography";
import { getResultSegment } from "@/lib/resultsData";
import { ProfileSegment } from "@/lib/pagePlan";
import { questions } from "@/lib/quizData";
import { diagnosisContent } from "@/lib/diagnosisContent";

type Segment = "BUILDER_STUCK" | "BUILDER_LEARNING" | "BUILDER_READY";

const SEGMENT_COPY: Record<Segment, {
  headline: string;
  subheadline: string;
  supportLine: string;
  rangeLabel: string;
}> = {
  BUILDER_STUCK: {
    headline: "You're at the start. Your next move matters.",
    subheadline: "Based on your results, you're still early in the journey—exploring if this idea is worth pursuing.",
    supportLine: "Next: we'll show the fastest way to validate without wasting weeks (or money).",
    rangeLabel: "Result: Builder Stuck (Score < 40)",
  },
  BUILDER_LEARNING: {
    headline: "You've started. Now avoid the wrong build.",
    subheadline: "You have momentum, but validation isn't strong enough yet to justify heavy building.",
    supportLine: "Next: we'll pinpoint what to test first so you don't overbuild.",
    rangeLabel: "Result: Builder Learning (Score 40–69)",
  },
  BUILDER_READY: {
    headline: "You're ready to validate. Speed matters now.",
    subheadline: "You're close to making costly decisions. The next step is to test with real users fast.",
    supportLine: "Next: we'll outline the shortest path from prototype → real feedback.",
    rangeLabel: "Result: Builder Ready (Score ≥ 70)",
  },
};


function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [profile, setProfile] = useState<ProfileSegment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  useEffect(() => {
    // Calculate max possible score
    const calculatedMaxScore = questions.reduce((max, question) => {
      if (question.allowMultiple) {
        // For multi-select, sum all positive points
        return max + question.choices.reduce((sum, choice) => sum + Math.max(0, choice.points), 0);
      } else {
        // For single-select, take the maximum
        return max + Math.max(...question.choices.map(c => c.points));
      }
    }, 0);
    setMaxScore(calculatedMaxScore);

    // Helper to convert hyphenated segment to underscore format
    const normalizeSegment = (segment: string): ProfileSegment => {
      const mapping: Record<string, ProfileSegment> = {
        "builder-stuck": "builder_stuck",
        "builder-learning": "builder_learning",
        "builder-ready": "builder_ready",
      };
      return mapping[segment] || "builder_stuck";
    };

    // Check for emailSent flag
    const emailSentParam = searchParams.get("emailSent");
    if (emailSentParam === "true") {
      setEmailSent(true);
    } else if (typeof window !== "undefined") {
      const storedEmailSent = sessionStorage.getItem("emailSent");
      if (storedEmailSent === "true") {
        setEmailSent(true);
      }
    }

    // Get score from URL params or sessionStorage
    const scoreParam = searchParams.get("score");
    if (scoreParam) {
      const parsedScore = parseInt(scoreParam, 10);
      if (!isNaN(parsedScore)) {
        setScore(parsedScore);
        const segment = getResultSegment(parsedScore);
        setProfile(normalizeSegment(segment));
        setIsLoading(false);
        return;
      }
    }

    // Fallback: try to get from sessionStorage (if redirected from quiz)
    if (typeof window !== "undefined") {
      const storedScore = sessionStorage.getItem("quizScore");
      if (storedScore) {
        const parsedScore = parseInt(storedScore, 10);
        if (!isNaN(parsedScore)) {
          setScore(parsedScore);
          const segment = getResultSegment(parsedScore);
          setProfile(normalizeSegment(segment));
          setIsLoading(false);
          return;
        }
      }
    }

    // No score found, redirect to home
    router.push("/");
  }, [searchParams, router]);

  if (isLoading || score === null || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  // Map profile segment to uppercase format for SEGMENT_COPY
  const getSegmentKey = (profile: ProfileSegment): Segment => {
    const mapping: Record<ProfileSegment, Segment> = {
      builder_stuck: "BUILDER_STUCK",
      builder_learning: "BUILDER_LEARNING",
      builder_ready: "BUILDER_READY",
    };
    return mapping[profile];
  };

  // Handle CTA clicks - opens widget URLs in popup window
  const handleCTAClick = (url: string) => {
    // For widget URLs, open in a popup window
    if (url.includes("api.ghlsandbox.net/widget")) {
      window.open(url, "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");
    } else {
      // For regular URLs, open in new tab
      window.open(url, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Section 1: Result Summary */}
        <section 
          className="mb-16 sm:mb-20" 
          aria-labelledby="result-summary-title"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text stack */}
            <div className="space-y-6">
              {profile && (
                <>
                  <Typography 
                    variant="h1" 
                    className="text-gray-900"
                    as="h1"
                    id="result-summary-title"
                  >
                    {SEGMENT_COPY[getSegmentKey(profile)].headline}
                  </Typography>
                  <Typography variant="lead">
                    {SEGMENT_COPY[getSegmentKey(profile)].subheadline}
                  </Typography>
                  <Typography variant="small" className="text-gray-500">
                    {SEGMENT_COPY[getSegmentKey(profile)].supportLine}
                  </Typography>
                  {emailSent && (
                    <Typography variant="small" className="text-gray-500">
                      We sent a copy of your result to your email so you can review it later.
                    </Typography>
                  )}
                </>
              )}
            </div>
            {/* Right: Meter */}
            <div className="flex justify-center lg:justify-end">
              <ScoreMeter score={score} maxScore={maxScore} />
            </div>
          </div>
        </section>

        {/* Section 2: Diagnosis */}
        <section 
          className="mb-16 sm:mb-20" 
          aria-labelledby="diagnosis-title"
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className={`
                relative bg-white rounded-lg border-l-8 p-8 sm:p-10 lg:p-12
                shadow-lg
                ${
                  profile === "builder_stuck"
                    ? "border-amber-500 bg-amber-50/30"
                    : profile === "builder_learning"
                    ? "border-blue-500 bg-blue-50/30"
                    : "border-green-500 bg-green-50/30"
                }
              `}
            >
              <div className="space-y-6">
                <Typography variant="body" className="text-gray-700">
                  At this stage, we typically see builders who {profile === "builder_stuck" ? "are" : "have"}:
                </Typography>
                
                <ul className="space-y-3 list-none">
                  {diagnosisContent[profile].characteristics.map((characteristic, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-400 mr-3 mt-1">•</span>
                      <Typography variant="body" className="text-gray-700">
                        {characteristic}
                      </Typography>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <Typography variant="body" className="font-semibold text-gray-900">
                    {diagnosisContent[profile].whatsWorking}
                  </Typography>
                  
                  <Typography variant="body" className="font-semibold text-gray-900">
                    {diagnosisContent[profile].whatsFragile}
                  </Typography>
                </div>

                <div className="pt-2">
                  <Typography variant="body" className="text-gray-700 whitespace-pre-line">
                    {diagnosisContent[profile].stageDescription}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 3: Pressure-Test Your Idea - Full Width */}
      <section className="w-full">
        <div className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left: Image */}
              <div className="relative w-full aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                <Image
                  src="/Carlo P Valencia.jpg"
                  alt="Carlo Valencia, Founder of Startup PH Training"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {/* Right: Text Content */}
              <div className="text-center lg:text-left space-y-6">
                <Typography variant="h2" as="h2" className="text-white">
                  Pressure-test your idea with someone outside your bubble
                </Typography>
                <Typography variant="body" className="text-white">
                  If you want, you can book a free call to walk through where you are and what you're about to commit to.
                </Typography>
                <Typography variant="body" className="font-semibold text-white">
                  This isn't a sales call.
                  <br />
                  It's a chance to sanity-check your direction before you go further.
                </Typography>
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleCTAClick("https://api.ghlsandbox.net/widget/booking/B7cMXh3yR0sMoOaaHiwV")}
                  >
                    Book a Free Call
                  </Button>
                </div>
                <Typography variant="small" className="text-white">
                  No obligation. No pressure. Just clarity.
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3.5: What Happens on the Call */}
      <section className="w-full">
        <div className="bg-background py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <Typography variant="h2" as="h2" className="text-white mb-8 sm:mb-10 text-center">
              What Happens on the Call
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-8">
              {/* What we'll do */}
              <div className="space-y-4">
                <Typography variant="h3" as="h3" className="text-white font-semibold">
                  On the call, we'll:
                </Typography>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      Walk through your idea and what you've already validated
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      Identify which assumptions matter most right now
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      Talk through whether your current timing and direction make sense
                    </Typography>
                  </li>
                </ul>
              </div>

              {/* What won't happen */}
              <div className="space-y-4">
                <Typography variant="h3" as="h3" className="text-white font-semibold">
                  What won't happen:
                </Typography>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      No pitching
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      No forcing you into anything
                    </Typography>
                  </li>
                  <li className="flex items-start">
                    <span className="text-white mr-3 mt-1">•</span>
                    <Typography variant="body" className="text-white">
                      No expectation to move forward beyond the conversation
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-white/20">
              <Typography variant="body" className="text-white">
                The call usually takes <span className="font-semibold">30–45 minutes</span>.
              </Typography>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: If You're Not Ready Yet - Full Width */}
      <section className="w-full">
        <div className="bg-primary py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center space-y-6">
            <Typography variant="h2" as="h2" className="text-white">
              If You're Not Ready Yet
            </Typography>
            <Typography variant="body" className="text-white">
              We've sent a copy of your results to your email so you can review them later.
            </Typography>
            <Typography variant="body" className="text-white">
              You don't need to decide anything today.
              <br />
              When you're ready to pressure-test your next move, the option is there.
            </Typography>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
}

