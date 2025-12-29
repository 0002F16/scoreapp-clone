"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function Home() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      firstName: formData.firstName.trim() ? "" : "First name is required",
      lastName: formData.lastName.trim() ? "" : "Last name is required",
      email: formData.email.trim()
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
          ? ""
          : "Please enter a valid email"
        : "Email is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Submit to database API
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitMessage({
          type: "error",
          text: data.error || "Failed to submit form. Please try again.",
        });
        setIsSubmitting(false);
        return;
      }

      // Store user data in sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(formData));
      
      // Show success message (only in dev mode - check if localhost)
      const isDevMode = typeof window !== "undefined" && 
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      
      if (isDevMode) {
        setSubmitMessage({
          type: "success",
          text: "Email successfully sent to database! Redirecting to quiz...",
        });
      }
      
      // Wait a moment to show the confirmation, then redirect
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitMessage(null);
        
        // Redirect to quiz page
        if (typeof window !== "undefined") {
          window.location.href = "/quiz";
        } else {
          router.push("/quiz");
        }
      }, isDevMode ? 2000 : 500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Content */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-12 sm:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Are You Ready to Build and Launch Your MVP?
          </h1>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0 mt-1 sm:mt-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Find out what's working, what missing and what to focus on.
            </p>
          </div>

          <p className="text-sm sm:text-base md:text-lg text-white opacity-90 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
            Most people can build an MVP but do you have what's needed to launch it and succeed? Get personalized feedback on validation, sales strategies, and marketing tactics—clear, actionable steps to move your MVP forward.
          </p>

          <div className="mt-2 sm:mt-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Take the Readiness Quiz
            </Button>
          </div>
        </div>

        {/* Right Panel - Stock Image */}
        <div className="flex-1 lg:flex-1 relative min-h-[400px] sm:min-h-[500px] lg:min-h-screen overflow-hidden bg-gray-800 hero-image">
          {/* Subtle overlay to ensure text readability and brand consistency */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/40 via-background/20 to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
            Enter your details below to start the scorecard
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {submitMessage && (
              <div
                className={`p-3 rounded-md text-sm ${
                  submitMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First name*"
                name="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                error={errors.firstName}
                required
                disabled={isSubmitting}
              />
              <Input
                label="Last name*"
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                error={errors.lastName}
                required
                disabled={isSubmitting}
              />
            </div>

            <Input
              label="Email *"
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              required
              disabled={isSubmitting}
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Start"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </main>
  );
}
