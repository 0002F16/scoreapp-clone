"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { questions, Question, Choice } from "@/lib/quizData";
import { getResultSegment } from "@/lib/resultsData";
import { cn } from "@/lib/utils";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

interface Answer {
  questionId: string;
  questionText: string;
  selectedChoices: string[];
  points: number;
}

export default function QuizPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSavingScore, setIsSavingScore] = useState(false);

  useEffect(() => {
    // Get user data from sessionStorage
    const storedData = sessionStorage.getItem("userData");
    if (storedData) {
      setUserData(JSON.parse(storedData));
    } else {
      // If no user data, redirect back to home
      router.push("/");
    }
  }, [router]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isMultiSelect = currentQuestion?.allowMultiple === true;

  const handleChoiceSelect = (choiceText: string) => {
    if (isMultiSelect) {
      // Toggle selection for multi-select
      setSelectedChoices((prev) =>
        prev.includes(choiceText)
          ? prev.filter((c) => c !== choiceText)
          : [...prev, choiceText]
      );
    } else {
      // Single select
      setSelectedChoices([choiceText]);
    }
  };

  const handleNext = async () => {
    if (!currentQuestion || selectedChoices.length === 0) return;

    // Calculate points for this question
    let points = 0;
    selectedChoices.forEach((selectedText) => {
      const choice = currentQuestion.choices.find(
        (c) => c.text === selectedText
      );
      if (choice) {
        points += choice.points;
      }
    });

    // Save answer
    const answer: Answer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      selectedChoices: [...selectedChoices],
      points: points,
    };
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Move to next question
    if (isLastQuestion) {
      // Calculate total score including this answer
      const finalScore = newAnswers.reduce((total, ans) => total + ans.points, 0);
      
      // Store score in sessionStorage for results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("quizScore", finalScore.toString());
      }
      
      // Save score to database and send email
      await saveScoreToDatabase(finalScore);
      
      // Check if email was sent (stored in sessionStorage by sendEmail function)
      const emailSent = typeof window !== "undefined" && sessionStorage.getItem("emailSent") === "true";
      
      // Redirect to results page
      router.push(`/results?score=${finalScore}${emailSent ? "&emailSent=true" : ""}`);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedChoices([]);
    }
  };

  const saveScoreToDatabase = async (score: number) => {
    if (!userData) return;

    setIsSavingScore(true);
    try {
      const response = await fetch("/api/quiz/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          score: score,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error saving score:", data.error);
      } else {
        console.log("Score saved successfully:", data.message);
        
        // Send email after score is saved successfully
        await sendEmail(score);
      }
    } catch (error) {
      console.error("Error saving quiz score:", error);
    } finally {
      setIsSavingScore(false);
    }
  };

  const sendEmail = async (score: number) => {
    if (!userData) return;

    try {
      const segment = getResultSegment(score);
      
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          score: score,
          segment: segment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error sending email:", data.error);
        // Don't block quiz completion if email fails
      } else {
        console.log("Email sent successfully:", data.message);
        // Store email sent flag in sessionStorage for results page
        if (typeof window !== "undefined") {
          sessionStorage.setItem("emailSent", "true");
        }
      }
    } catch (error) {
      console.error("Error sending email:", error);
      // Don't block quiz completion if email fails
    }
  };

  if (!userData) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16">
        <div className="mb-8">
          <div className="text-sm font-medium text-gray-500 mb-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {currentQuestion?.text}
          </h1>
        </div>

        <div className="space-y-4 mb-8">
          {currentQuestion?.choices.map((choice, index) => {
            const isSelected = selectedChoices.includes(choice.text);
            return (
              <button
                key={index}
                onClick={() => handleChoiceSelect(choice.text)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary-50 text-gray-900"
                    : "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50"
                )}
              >
                <span className="font-medium">{choice.text}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="lg"
            onClick={handleNext}
            disabled={selectedChoices.length === 0}
            className="w-full sm:w-auto"
          >
            {isLastQuestion ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

