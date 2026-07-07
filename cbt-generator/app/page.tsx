"use client";

import { useState } from "react";
import Link from "next/link";
import QuizView from "@/components/QuizView";
import { Option, Question } from "@/lib/types";
import { saveQuiz, makeTitleFromNotes } from "@/lib/storage";

export default function Home() {
  const [notes, setNotes] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, Option>>({});
  const [submitted, setSubmitted] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setQuestions(null);
    setAnswers({});
    setSubmitted(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, numQuestions }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setQuestions(data.questions);
      }
    } catch (e) {
      setError("Couldn't reach the question generator. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qIndex: number, opt: Option) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: opt }));
  }

  function handleSubmit() {
    if (!questions) return;
    setSubmitted(true);

    const score = questions.reduce(
      (acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc),
      0
    );

    saveQuiz({
      id: crypto.randomUUID(),
      title: makeTitleFromNotes(notes),
      createdAt: new Date().toISOString(),
      questions,
      answers,
      score,
    });
  }

  const score =
    questions && submitted
      ? questions.reduce(
          (acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc),
          0
        )
      : null;

  return (
    <main className="min-h-screen hall-texture">
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Nav */}
        <div className="flex justify-end mb-6">
          <Link
            href="/history"
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-marker transition-colors"
          >
            Past quizzes →
          </Link>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <p className="font-mono text-xs tracking-widest text-marker uppercase mb-3">
            Any Subject &middot; Any Notes
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-textInk leading-tight mb-4">
            Turn your notes into
            <br />a CBT practice test.
          </h1>
          <p className="text-muted text-base max-w-xl">
            Paste in notes on anything — biology, law, scripture, cooking, a work
            manual — and get exam-style multiple-choice questions, shaded bubbles
            and all.
          </p>
        </div>

        {/* Input card */}
        <div className="paper-card rounded-sm p-6 mb-10">
          <label className="font-mono text-xs uppercase tracking-wide text-muted block mb-2">
            Paste your notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. The mitochondria is the powerhouse of the cell. It generates ATP through..."
            className="w-full h-48 bg-transparent border border-paperLine rounded-sm p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-marker resize-none"
          />
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-2">
              <label className="font-mono text-xs uppercase tracking-wide text-muted">
                Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="border border-paperLine rounded-sm px-2 py-1 text-sm bg-white"
              >
                {[3, 5, 10, 15, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading || notes.trim().length < 20}
              className="bg-ink text-paper font-mono text-sm uppercase tracking-wide px-6 py-2.5 rounded-sm hover:bg-marker hover:text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Setting questions…" : "Generate questions"}
            </button>
          </div>
          {error && (
            <p className="text-sm text-[#e2584f] mt-3 font-body">{error}</p>
          )}
        </div>

        {/* Questions */}
        {questions && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl text-textInk font-medium">
                Your practice test
              </h2>
              {submitted && score !== null && (
                <span className="font-mono text-sm text-marker">
                  Score: {score} / {questions.length}
                </span>
              )}
            </div>

            <QuizView
              questions={questions}
              answers={answers}
              submitted={submitted}
              onSelect={selectAnswer}
            />

            {!submitted && (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length !== questions.length}
                className="bg-marker text-ink font-mono text-sm uppercase tracking-wide px-6 py-2.5 rounded-sm hover:bg-markerDark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit test
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
