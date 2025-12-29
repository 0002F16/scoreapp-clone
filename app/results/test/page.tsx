"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

export default function ResultsTestPage() {
  const router = useRouter();
  const [customScore, setCustomScore] = useState<string>("");

  const testScores = [
    { label: "Builder Stuck (Low Score)", score: 25, description: "Score < 40" },
    { label: "Builder Learning (Medium Score)", score: 55, description: "Score 40-69" },
    { label: "Builder Ready (High Score)", score: 85, description: "Score >= 70" },
  ];

  const handleTestScore = (score: number) => {
    router.push(`/results?score=${score}`);
  };

  const handleCustomScore = () => {
    const score = parseInt(customScore, 10);
    if (!isNaN(score) && score >= 0) {
      router.push(`/results?score=${score}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <Typography variant="h1" className="mb-4">
            Test Results Page
          </Typography>
          <Typography variant="body" className="mb-8 text-gray-600">
            Quickly test the results page with different scores without going through the quiz.
            This page doesn't make any backend API calls.
          </Typography>

          <div className="space-y-4 mb-8">
            <Typography variant="h3" className="mb-4">
              Quick Test Scores
            </Typography>
            {testScores.map((test) => (
              <div
                key={test.score}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h4" className="mb-1">
                      {test.label}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {test.description} • Score: {test.score}
                    </Typography>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleTestScore(test.score)}
                  >
                    Test
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <Typography variant="h3" className="mb-4">
              Custom Score
            </Typography>
            <div className="flex gap-4">
              <input
                type="number"
                value={customScore}
                onChange={(e) => setCustomScore(e.target.value)}
                placeholder="Enter any score (0-100)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                min="0"
                max="100"
              />
              <Button
                variant="outline"
                size="md"
                onClick={handleCustomScore}
                disabled={!customScore || isNaN(parseInt(customScore, 10))}
              >
                Test Custom Score
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Button
              variant="outline"
              size="md"
              onClick={() => router.push("/")}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}












