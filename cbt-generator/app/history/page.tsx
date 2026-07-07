"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SavedQuiz } from "@/lib/types";
import { getQuizzes, deleteQuiz } from "@/lib/storage";
import QuizView from "@/components/QuizView";

export default function History() {
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setQuizzes(getQuizzes());
  }, []);

  function handleDelete(id: string) {
    deleteQuiz(id);
    setQuizzes(getQuizzes());
    if (openId === id) setOpenId(null);
  }

  const open = quizzes.find((q) => q.id === openId);

  return (
    <main className="min-h-screen hall-texture">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display text-3xl font-semibold text-textInk">
            Past quizzes
          </h1>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-widest text-muted hover:text-marker transition-colors"
          >
            ← New quiz
          </Link>
        </div>

        {quizzes.length === 0 && (
          <p className="text-muted text-sm">
            Nothing saved yet. Take a quiz and it'll show up here.
          </p>
        )}

        {!open && (
          <div className="space-y-3">
            {quizzes.map((q) => (
              <div
                key={q.id}
                className="paper-card rounded-sm p-4 flex items-center justify-between gap-4"
              >
                <button
                  onClick={() => setOpenId(q.id)}
                  className="text-left flex-1"
                >
                  <p className="font-medium text-sm mb-1">{q.title}</p>
                  <p className="font-mono text-xs text-muted">
                    {new Date(q.createdAt).toLocaleDateString()} &middot;{" "}
                    {q.questions.length} questions &middot; Score {q.score}/
                    {q.questions.length}
                  </p>
                </button>
                <button
                  onClick={() => handleDelete(q.id)}
                  className="font-mono text-xs text-muted hover:text-[#e2584f] transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {open && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setOpenId(null)}
                className="font-mono text-xs uppercase tracking-widest text-muted hover:text-marker transition-colors"
              >
                ← Back to list
              </button>
              <span className="font-mono text-sm text-marker">
                Score: {open.score} / {open.questions.length}
              </span>
            </div>
            <QuizView
              questions={open.questions}
              answers={open.answers}
              submitted={true}
            />
          </div>
        )}
      </div>
    </main>
  );
}
