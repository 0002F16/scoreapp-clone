"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScoreMeter } from "@/components/ui/ScoreMeter";
import { Typography } from "@/components/ui/Typography";
import { getResultSegment } from "@/lib/resultsData";
import { pagePlan, ProfileSegment, CTAType } from "@/lib/pagePlan";
import { resultsContent, SectionContent } from "@/lib/resultsContent";
import { questions } from "@/lib/quizData";
import { cn } from "@/lib/utils";

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [score, setScore] = useState<number | null>(null);
  const [maxScore, setMaxScore] = useState<number>(100);
  const [profile, setProfile] = useState<ProfileSegment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleCTAClick = (url: string, ctaType: CTAType) => {
    // For widget URLs, open in new window/tab
    if (url.includes("api.ghlsandbox.net/widget")) {
      window.open(url, "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");
    } else {
      // For regular URLs, open in new tab
      window.open(url, "_blank");
    }
  };

  const getPrimaryCTA = (): CTAType => {
    if (!profile) return "discoveryCall";
    return pagePlan.segmentationLogic[profile].primaryCTA;
  };

  const getEmphasizedCTA = (): CTAType => {
    if (!profile) return "discoveryCall";
    return pagePlan.segmentationLogic[profile].emphasizedCTA;
  };

  const getCTALabel = (ctaType: CTAType): string => {
    return pagePlan.globalCTAs[ctaType].label || " ";
  };

  const getCTAURL = (ctaType: CTAType): string => {
    return pagePlan.globalCTAs[ctaType].url;
  };

  if (isLoading || score === null || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading results...</div>
      </div>
    );
  }

  const primaryCTA = getPrimaryCTA();
  const emphasizedCTA = getEmphasizedCTA();

  // Get content based on segmentation
  const getSectionContent = (sectionId: string): SectionContent => {
    if (!profile) {
      // Fallback to empty content if profile is not set
      return { heading: " ", subheading: " ", body: " ", bullets: [] };
    }
    
    if (sectionId === "result_snapshot" || sectionId === "final_nudge") {
      const profileSpecificContent = resultsContent[sectionId as "result_snapshot" | "final_nudge"];
      return profileSpecificContent[profile];
    }
    return resultsContent[sectionId as keyof typeof resultsContent] as SectionContent;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
        {/* Section 1: Result Snapshot */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <Typography variant="h1" className="text-gray-900">
                {getSectionContent("result_snapshot").heading || " "}
              </Typography>
              {getSectionContent("result_snapshot").subheading && (
                <Typography variant="lead">
                  {getSectionContent("result_snapshot").subheading}
                </Typography>
              )}
              {getSectionContent("result_snapshot").body && (
                <div className="space-y-4">
                  {getSectionContent("result_snapshot").body
                    .split("\n\n")
                    .filter((para) => para.trim())
                    .map((paragraph, index) => (
                      <Typography key={index} variant="body">
                        {paragraph.trim()}
                </Typography>
                    ))}
                </div>
              )}
              <div className="pt-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => handleCTAClick(getCTAURL(primaryCTA), primaryCTA)}
                  className="w-full sm:w-auto"
                >
                  {getCTALabel(primaryCTA) || " "}
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <ScoreMeter score={score} maxScore={maxScore} />
            </div>
          </div>
        </section>

        {/* Section 2: Who We Are */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 overflow-hidden rounded-lg">
            {/* Left side - Text content (2/3 width) */}
            <div className="lg:col-span-2 bg-background p-8 sm:p-12 lg:p-16">
              <div className="space-y-6">
                <Typography variant="h1" className="text-white">
                  {getSectionContent("who_we_are").heading || " "}
                </Typography>
                {getSectionContent("who_we_are").body && (
                  <div className="space-y-4">
                    {getSectionContent("who_we_are").body
                      .split("\n\n")
                      .filter((para) => para.trim())
                      .map((paragraph, index) => (
                        <Typography key={index} variant="body" className="text-white">
                          {paragraph.trim()}
                        </Typography>
                      ))}
                  </div>
                )}
              </div>
            </div>
            {/* Right side - Image (1/3 width) */}
            <div className="lg:col-span-1 relative bg-gray-200 min-h-[400px] lg:min-h-[600px]">
              <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-10">
                <Typography variant="small" className="text-white">
                  Who we are
                </Typography>
              </div>
              <div className="w-full h-full relative">
                <Image
                  src="/carlo.jpg"
                  alt="Carlo, Founder of Startup PH Training"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: What Happens */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 overflow-hidden rounded-lg">
            {/* Left side - Image (1/2 width) */}
            <div className="lg:col-span-1 relative bg-gray-200 min-h-[400px] lg:min-h-[500px]">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                  <div className="text-center p-4">
                    <Typography variant="body" className="text-gray-500 mb-2">
                      Placeholder Image
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                      800×500px
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                      (Landscape)
                    </Typography>
                  </div>
                </div>
                {/* Uncomment when image is ready */}
                {/* <Image
                  src="/workshop.jpg"
                  alt="Workshop session with founders building their MVP"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                /> */}
              </div>
            </div>
            {/* Right side - Text content (1/2 width) */}
            <div className="lg:col-span-1 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-6">
                <Typography variant="h2" className="text-gray-900">
                  {getSectionContent("what_happens").heading || " "}
                </Typography>
                {getSectionContent("what_happens").subheading && (
                  <Typography variant="h4" className="text-gray-900 font-semibold">
                    {getSectionContent("what_happens").subheading}
                  </Typography>
                )}
                {getSectionContent("what_happens").body && (
                  <Typography variant="body" className="text-gray-600">
                    {getSectionContent("what_happens").body}
                  </Typography>
                )}
                {getSectionContent("what_happens").bullets.length > 0 && (
                  <ul className="space-y-3">
                    {getSectionContent("what_happens").bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-3 mt-1 text-xl">✓</span>
                        <Typography variant="body" className="text-gray-600">
                          {bullet || " "}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleCTAClick(getCTAURL("signupForm"), "signupForm")}
                    className="w-full sm:w-auto"
                  >
                    Register for our workshop
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Coaching Program (Mirrored) */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-0 overflow-hidden rounded-lg">
            {/* Left side - Text content (1/2 width) */}
            <div className="lg:col-span-1 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="space-y-6">
                <Typography variant="h2" className="text-gray-900">
                  {getSectionContent("coaching_program").heading || " "}
                </Typography>
                {getSectionContent("coaching_program").body && (
                  <div className="space-y-4">
                    {getSectionContent("coaching_program").body
                      .split("\n\n")
                      .filter((para) => para.trim())
                      .map((paragraph, index) => (
                        <Typography key={index} variant="body" className="text-gray-600">
                          {paragraph.trim()}
                        </Typography>
                      ))}
                  </div>
                )}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => handleCTAClick(getCTAURL("signupForm"), "signupForm")}
                    className="w-full sm:w-auto"
                  >
                    Register for our workshop
                  </Button>
                </div>
              </div>
            </div>
            {/* Right side - Image (1/2 width) */}
            <div className="lg:col-span-1 relative bg-gray-200 min-h-[400px] lg:min-h-[500px]">
              <div className="w-full h-full relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                  <div className="text-center p-4">
                    <Typography variant="body" className="text-gray-500 mb-2">
                      Placeholder Image
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                      400×600px
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                      (Portrait)
                    </Typography>
                  </div>
                </div>
                {/* Uncomment when image is ready */}
                {/* <Image
                  src="/coaching.jpg"
                  alt="Coaching session with founders"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                /> */}
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Why This Matters */}
        <section className="mb-16 sm:mb-20">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("why_this_matters").heading || " "}
          </Typography>
          {getSectionContent("why_this_matters").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("why_this_matters").subheading}
            </Typography>
          )}
          {getSectionContent("why_this_matters").body && (
            <Typography variant="body" className="mb-6">
              {getSectionContent("why_this_matters").body}
            </Typography>
          )}
          <ul className="space-y-3">
            {getSectionContent("why_this_matters").bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <Typography variant="body">{bullet || " "}</Typography>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6: Program Snapshot */}
        <section className="mb-16 sm:mb-20">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("program_snapshot").heading || " "}
          </Typography>
          {getSectionContent("program_snapshot").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("program_snapshot").subheading}
            </Typography>
          )}
          {getSectionContent("program_snapshot").body && (
            <Typography variant="body" className="mb-6">
              {getSectionContent("program_snapshot").body}
            </Typography>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {getSectionContent("program_snapshot").bullets.map((step, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-2">{index + 1}</div>
                <Typography variant="body">{step || " "}</Typography>
              </div>
            ))}
          </div>
          {pagePlan.sections.find(s => s.id === "program_snapshot")?.contentPlaceholders.cta && (
            <div className="pt-4">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleCTAClick(getCTAURL("discoveryCall"), "discoveryCall")}
              >
                {getCTALabel("discoveryCall") || " "}
              </Button>
            </div>
          )}
        </section>

        {/* Section 7: Investment */}
        <section className="mb-16 sm:mb-20">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("investment").heading || " "}
          </Typography>
          {getSectionContent("investment").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("investment").subheading}
            </Typography>
          )}
          <div className="bg-gray-50 p-8 rounded-lg mb-6">
            <div className="space-y-4">
              <div>
                <Typography variant="h3" className="text-gray-900 mb-2">
                  Standard Rate: ₱49,800
                </Typography>
              </div>
              <div>
                <Typography variant="h4" className="text-primary mb-2">
                  Founders Launch Rate: ₱24,950
                </Typography>
                <Typography variant="small" className="text-gray-600">
                  (For the first 5 founders who enroll)
                </Typography>
              </div>
            </div>
          </div>
          {getSectionContent("investment").body && (
            <Typography variant="body" className="mb-4">
              {getSectionContent("investment").body}
            </Typography>
          )}
          <ul className="space-y-3">
            {getSectionContent("investment").bullets.map((bullet, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-3 mt-1">•</span>
                <Typography variant="body">{bullet || " "}</Typography>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 8: Who This Is For */}
        <section className="mb-16 sm:mb-20">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("who_this_is_for").heading || " "}
          </Typography>
          {getSectionContent("who_this_is_for").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("who_this_is_for").subheading}
            </Typography>
          )}
          {getSectionContent("who_this_is_for").body && (
            <Typography variant="body" className="mb-6">
              {getSectionContent("who_this_is_for").body}
            </Typography>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Typography variant="h4" className="text-green-600 mb-4">
                Who this is for
              </Typography>
              <ul className="space-y-2">
                {getSectionContent("who_this_is_for").bullets.slice(0, Math.ceil(getSectionContent("who_this_is_for").bullets.length / 2)).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1">✓</span>
                    <Typography variant="body">{item || " "}</Typography>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Typography variant="h4" className="text-red-600 mb-4">
                Who this is not for
              </Typography>
              <ul className="space-y-2">
                {getSectionContent("who_this_is_for").bullets.slice(Math.ceil(getSectionContent("who_this_is_for").bullets.length / 2)).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">✗</span>
                    <Typography variant="body">{item || " "}</Typography>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 9: Ways to Move Forward */}
        <section className="mb-16 sm:mb-20">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("ways_to_move_forward").heading || " "}
          </Typography>
          {getSectionContent("ways_to_move_forward").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("ways_to_move_forward").subheading}
            </Typography>
          )}
          {getSectionContent("ways_to_move_forward").body && (
            <Typography variant="body" className="mb-6">
              {getSectionContent("ways_to_move_forward").body}
            </Typography>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Discovery Call Card */}
            <div
              className={cn(
                "p-6 rounded-lg border-2 transition-all",
                emphasizedCTA === "discoveryCall"
                  ? "border-primary bg-primary-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-primary-300"
              )}
            >
              <Typography variant="h4" className="mb-3">
                Discovery Call
              </Typography>
              <Typography variant="body" className="mb-4">
                Schedule a call to discuss your specific situation and get clarity on next steps.
              </Typography>
              {emphasizedCTA === "discoveryCall" && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary-100 px-2 py-1 rounded">
                    RECOMMENDED
                  </span>
                </div>
              )}
              <Button
                variant={emphasizedCTA === "discoveryCall" ? "primary" : "outline"}
                size="md"
                className="w-full"
                onClick={() => handleCTAClick(getCTAURL("discoveryCall"), "discoveryCall")}
              >
                {getCTALabel("discoveryCall") || "Schedule Discovery Call"}
              </Button>
            </div>

            {/* Signup Form Card */}
            <div
              className={cn(
                "p-6 rounded-lg border-2 transition-all",
                emphasizedCTA === "signupForm"
                  ? "border-primary bg-primary-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-primary-300"
              )}
            >
              <Typography variant="h4" className="mb-3">
                Signup Form
              </Typography>
              <Typography variant="body" className="mb-4">
                Ready to enroll? Complete the signup form to secure your spot in the program.
              </Typography>
              {emphasizedCTA === "signupForm" && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-primary bg-primary-100 px-2 py-1 rounded">
                    RECOMMENDED
                  </span>
                </div>
              )}
              <Button
                variant={emphasizedCTA === "signupForm" ? "primary" : "outline"}
                size="md"
                className="w-full"
                onClick={() => handleCTAClick(getCTAURL("signupForm"), "signupForm")}
              >
                {getCTALabel("signupForm") || "Sign Up Now"}
              </Button>
            </div>

            {/* Contact Us Card */}
            <div
              className={cn(
                "p-6 rounded-lg border-2 transition-all",
                "border-gray-200 bg-white hover:border-primary-300"
              )}
            >
              <Typography variant="h4" className="mb-3">
                Contact Us
              </Typography>
              <Typography variant="body" className="mb-4">
                Have questions? Reach out to our team for more information.
              </Typography>
              <Button
                variant="outline"
                size="md"
                className="w-full"
                onClick={() => handleCTAClick(getCTAURL("contactUs"), "contactUs")}
              >
                {getCTALabel("contactUs") || "Contact Us"}
              </Button>
            </div>
          </div>
        </section>

        {/* Section 10: Final Nudge */}
        <section className="mb-8">
          <Typography variant="h2" className="mb-6">
            {getSectionContent("final_nudge").heading || " "}
          </Typography>
          {getSectionContent("final_nudge").subheading && (
            <Typography variant="lead" className="mb-4">
              {getSectionContent("final_nudge").subheading}
            </Typography>
          )}
          {getSectionContent("final_nudge").body && (
            <Typography variant="body" className="mb-6">
              {getSectionContent("final_nudge").body}
            </Typography>
          )}
          <div className="pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleCTAClick(getCTAURL(primaryCTA), primaryCTA)}
              className="w-full sm:w-auto"
            >
              {getCTALabel(primaryCTA) || " "}
            </Button>
          </div>
        </section>
      </div>
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

